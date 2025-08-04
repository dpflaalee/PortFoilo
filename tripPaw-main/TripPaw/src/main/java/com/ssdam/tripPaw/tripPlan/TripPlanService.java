package com.ssdam.tripPaw.tripPlan;

import com.ssdam.tripPaw.dto.TripRecommendRequest;
import com.ssdam.tripPaw.dto.TripRecommendResponse;
import com.ssdam.tripPaw.dto.TripSaveRequest;
import com.ssdam.tripPaw.memberTripPlan.MemberTripPlanMapper;
import com.ssdam.tripPaw.place.PlaceMapper;
import com.ssdam.tripPaw.domain.*;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.InputStream;
import java.io.ByteArrayInputStream;
import java.nio.file.*;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.*;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.stream.Collectors;
import java.util.Base64;

@Service
@RequiredArgsConstructor
public class TripPlanService {

	private final PlaceMapper placeMapper;
	private final TripPlanMapper tripPlanMapper;
	private final MemberTripPlanMapper memberTripPlanMapper;

	@Value("${upload.directory:C:/upload/tripThumbnails/}")
	private String uploadDir;

	//// 경로추천 받기 -> 경로 수정하기 -> TripPlan 저장하기
	public TripPlan saveTrip(TripSaveRequest request) {
		TripPlan tripPlan = new TripPlan();
		try {
			String imagePath = saveBase64Image(request.getMapImage());
			tripPlan.setTitle(request.getTitle());
			tripPlan.setDays(request.getRouteData().size());
			tripPlan.setPublicVisible(false);
			tripPlan.setImageUrl(imagePath);
			Member member = new Member();
			member.setId(request.getMemberId());
			tripPlan.setMember(member);
			tripPlanMapper.insertTripPlan(tripPlan);

			for (TripSaveRequest.RouteDay routeDay : request.getRouteData()) {
				Route route = new Route();
				route.setName(request.getTitle() + "_" + routeDay.getDay() + "일차");
				tripPlanMapper.insertRoute(route);

				AtomicInteger sequence = new AtomicInteger(1);
				for (TripSaveRequest.PlaceDto placeDto : routeDay.getPlaces()) {
					Place place = new Place();
					place.setId(placeDto.getPlaceId());
					RoutePlace routePlace = new RoutePlace();
					routePlace.setRoute(route);
					routePlace.setPlace(place);
					routePlace.setSequence(sequence.getAndIncrement());
					tripPlanMapper.insertRoutePlace(routePlace);
				}

				TripPlanCourse course = new TripPlanCourse();
				course.setTripPlan(tripPlan);
				course.setRoute(route);
				tripPlanMapper.insertTripPlanCourse(course);
			}

		} catch (Exception e) {
			throw new RuntimeException("여행 저장 실패", e);
		}
		return tripPlan;
	}

	// 썸네일 저장하기
	private String saveBase64Image(String base64Data) {
		if (base64Data == null || base64Data.isBlank())
			return null;
		try {
			String[] parts = base64Data.split(",");
			String imageBytesString = (parts.length > 1) ? parts[1] : parts[0];
			byte[] imageBytes = Base64.getDecoder().decode(imageBytesString);
			String fileName = UUID.randomUUID().toString() + ".png";
			Path savePath = Paths.get(uploadDir, fileName);
			Files.createDirectories(savePath.getParent());
			try (InputStream in = new ByteArrayInputStream(imageBytes)) {
				Files.copy(in, savePath, StandardCopyOption.REPLACE_EXISTING);
			}
			return "/thumbnails/" + fileName;
		} catch (Exception e) {
			throw new RuntimeException("Base64 이미지 저장 실패", e);
		}
	}

	// 경로 가져오기
	public TripPlan findByIdWithCourses(Long id) {
		return tripPlanMapper.findByIdWithCourses(id);
	}

	// 특정 유저가 만든 여행 가져오기
	public List<TripPlan> findByMemberIdWithReviews(Long id) {
		return tripPlanMapper.findByMemberIdWithReviews(id);
	}

	// 공개로 전환하기
	@Transactional
	public void makeTripPublic(Long tripPlanId) {
		Boolean isAlreadyPublic = tripPlanMapper.isTripPlanPublic(tripPlanId);
		if (Boolean.TRUE.equals(isAlreadyPublic)) {
			throw new IllegalStateException("이미 공개된 여행입니다.");
		}

		tripPlanMapper.makeTripPlanPublic(tripPlanId);
	}

	// 삭제
	public void deleteTripPlan(Long id) {
		TripPlan tripPlan = tripPlanMapper.findByIdWithCourses(id);
		if (tripPlan == null) {
			throw new IllegalArgumentException("해당 TripPlan을 찾을 수 없습니다.");
		}
		tripPlanMapper.update(tripPlan);

		/*
		 * if (tripPlan.isPublicVisible()) { // 공개된 경우: 소프트 딜리트 (memberId를 1로 변경)
		 * tripPlanMapper.update(tripPlan); } else { // 비공개인 경우: 완전 삭제
		 * tripPlanMapper.delete(id); }
		 */
	}

	//////////////////////////////////////////////////////////////////////////////////////////
	// 여행 추천 받기
	public List<TripRecommendResponse> recommend(TripRecommendRequest request) {
		LocalDate startDate = LocalDate.parse(request.getStartDate());
		LocalDate endDate = LocalDate.parse(request.getEndDate());
		int totalDays = calculateTripDays(startDate, endDate);

		List<TripRecommendResponse> tripPlans = new ArrayList<>();
		
		String region = request.getRegion();

		for (int i = 0; i < totalDays; i++) {
			List<Long> usedPlaceIds = new ArrayList<>();
		    List<TripRecommendResponse.PlaceInfo> placeInfos = new ArrayList<>();

		    Place firstPlace = placeMapper.findFirstRandomPlaceExcluding(request.getRegion(), null);
		    if (firstPlace != null) {
		        usedPlaceIds.add(firstPlace.getId());
		        placeInfos.add(toPlaceInfo(firstPlace));


		        Place secondPlace = findNearestPlace(6, firstPlace, request.getRegion(), usedPlaceIds);
		        if (secondPlace != null) {
		            usedPlaceIds.add(secondPlace.getId());
		            placeInfos.add(toPlaceInfo(secondPlace));
		        }

		        int[] types = { 1, 2, 3, 4, 5, 7 };
		        int randomType = types[new Random().nextInt(types.length)];
		        Place thirdPlace = findNearestPlace(randomType, secondPlace != null ? secondPlace : firstPlace, request.getRegion(), usedPlaceIds);
		        if (thirdPlace != null) {
		            usedPlaceIds.add(thirdPlace.getId());
		            placeInfos.add(toPlaceInfo(thirdPlace));
		        }

		        Place fourthPlace = findNearestPlace(4,
		            thirdPlace != null ? thirdPlace : (secondPlace != null ? secondPlace : firstPlace),
		            region, usedPlaceIds);
		        if (fourthPlace != null) {
		            usedPlaceIds.add(fourthPlace.getId());
		            placeInfos.add(toPlaceInfo(fourthPlace));
		        }
		    }

		    // 무조건 결과에 추가 (4개가 안 차도)
		    tripPlans.add(new TripRecommendResponse(i + 1, placeInfos, startDate, endDate));
		}
		
		return tripPlans;
	}

	private Place findNearestPlace(int placeType, Place base, String region, List<Long> usedIds) {
		List<Place> candidates = placeMapper.findPlacesByTypeAndDistanceExcluding(placeType, region, base.getLatitude(),
				base.getLongitude(), 10, usedIds );
		System.out.println("후보 장소 개수: " + candidates.size());
		return (candidates == null || candidates.isEmpty()) ? null : candidates.get(0);
	}

	private TripRecommendResponse.PlaceInfo toPlaceInfo(Place place) {
		return new TripRecommendResponse.PlaceInfo(place.getId(), place.getName(), place.getDescription(),
				String.valueOf(place.getLatitude()), String.valueOf(place.getLongitude()), place.getImageUrl());
	}

	private int calculateTripDays(LocalDate startDate, LocalDate endDate) {
		return (int) ChronoUnit.DAYS.between(startDate, endDate) + 1;
	}

	//////////////////////////////
	// 모든 여행 가져오기
	public List<TripPlan> getAllTrips() {
		return tripPlanMapper.findAllTrips();
	}
}
