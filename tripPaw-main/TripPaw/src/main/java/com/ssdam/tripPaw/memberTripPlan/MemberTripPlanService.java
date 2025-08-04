package com.ssdam.tripPaw.memberTripPlan;

import java.io.ByteArrayInputStream;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Base64;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicInteger;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.ssdam.tripPaw.domain.Member;
import com.ssdam.tripPaw.domain.MemberTripPlan;
import com.ssdam.tripPaw.domain.Place;
import com.ssdam.tripPaw.domain.Route;
import com.ssdam.tripPaw.domain.RoutePlace;
import com.ssdam.tripPaw.domain.TripPlan;
import com.ssdam.tripPaw.domain.TripPlanCourse;
import com.ssdam.tripPaw.dto.MemberTripPlanSaveRequest;
import com.ssdam.tripPaw.dto.MyTripsDto;
import com.ssdam.tripPaw.dto.TripSaveRequest;
import com.ssdam.tripPaw.place.PlaceMapper;
import com.ssdam.tripPaw.reserv.ReservMapper;
import com.ssdam.tripPaw.tripPlan.TripPlanMapper;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class MemberTripPlanService {

	private final MemberTripPlanMapper memberTripPlanMapper;
	private final PlaceMapper placeMapper;
	private final TripPlanMapper tripPlanMapper;
	private final ReservMapper reservMapper;
	
	@Value("${upload.directory:C:/upload/tripThumbnails/}")
	private String uploadDir;
	
	//경로 삭제하기
	public void deleteMemberTripPlan(Long id) {
		int result = memberTripPlanMapper.delete(id);
		if (result == 0) {
		    throw new IllegalArgumentException("삭제할 여행이 존재하지 않습니다. ID: " + id);
		}
	}
	
	// 다른 유저의 TripPlan을 memberTripPlan으로 저장
	public void saveMemberTripPlan(MemberTripPlanSaveRequest request) {
		// 1. 기존 저장 여부 확인
		boolean alreadyExists = memberTripPlanMapper.existsByMemberIdAndTripPlanId(
		    request.getMemberId(), request.getTripPlanId()
		);
		if (alreadyExists) {
		    throw new IllegalStateException("이미 저장한 여행입니다.");
		}
	
		// 2. 예약 날짜 겹침 확인
		if (isOverlappingWithReservedDates(
			request.getTripPlanId(),
			LocalDate.parse(request.getStartDate()),
			LocalDate.parse(request.getEndDate()))
		) {
		    throw new IllegalStateException("해당 여행은 일부 날짜가 예약되어 저장할 수 없습니다.");
		}
	
		// 3. 저장 로직
		Member member = new Member();
		member.setId(request.getMemberId());
		
		TripPlan tripPlan = new TripPlan();
		tripPlan.setId(request.getTripPlanId());
		
		MemberTripPlan entity = MemberTripPlan.builder()
		    .member(member)
		    .tripPlan(tripPlan)
		    .startDate(LocalDate.parse(request.getStartDate()))
		    .endDate(LocalDate.parse(request.getEndDate()))
		    .countPeople(request.getCountPeople())
		    .countPet(request.getCountPet())
		    .titleOverride(request.getTitleOverride())
		    .createdAt(LocalDateTime.now())
		    .build();
		
		memberTripPlanMapper.insertMemberTripPlan(entity);
		
	}
	
	private boolean isOverlappingWithReservedDates(Long tripPlanId, LocalDate newStart, LocalDate newEnd) {
		List<Map<String, Object>> reservedRanges = reservMapper.findReservedRangesByTripPlanId(tripPlanId);
		
		for (Map<String, Object> range : reservedRanges) {
		    java.sql.Date sqlStart = (java.sql.Date) range.get("start_date");
		    java.sql.Date sqlEnd = (java.sql.Date) range.get("end_date");
		
		    LocalDate start = sqlStart.toLocalDate();
		    LocalDate end = sqlEnd.toLocalDate();
		
		    if (!(newEnd.isBefore(start) || newStart.isAfter(end))) {
			return true;
		    }
		}
	
		return false;
	}
	
	
	// 특정 유저의 내 여행(TripPlan) 목록 조회
	@Transactional(readOnly = true)
	public List<MyTripsDto> getMyTripsByMember(Long memberId) {
		List<MemberTripPlan> myTrips = memberTripPlanMapper.findByMemberId(memberId);
		List<MyTripsDto> result = new ArrayList<>();
	
		for (MemberTripPlan mtp : myTrips) {
			if (mtp == null || mtp.getTripPlan() == null)
				continue;
	
			TripPlan tripPlan = mtp.getTripPlan();
	
			List<TripPlanCourse> tripPlanCourses = tripPlan.getTripPlanCourses();
	
			// 대표 이미지 설정
			String imageUrl = null;
			/*
			 * if (tripPlanCourses != null && !tripPlanCourses.isEmpty()) { TripPlanCourse
			 * firstCourse = tripPlanCourses.get(0); Place place = firstCourse.getPlace();
			 * if (place != null) { imageUrl = place.getImageUrl(); } }
			 */
	
			MyTripsDto dto = new MyTripsDto();
			dto.setMyTripId(mtp.getId());
			dto.setMemberId(memberId);
			dto.setTripPlanId(tripPlan.getId());
			dto.setTitle(mtp.getTitleOverride());
			dto.setDays(tripPlan.getDays());
			dto.setStartDate(mtp.getStartDate());
			dto.setEndDate(mtp.getEndDate());
			dto.setPublicVisible(tripPlan.isPublicVisible());
			dto.setCreatedAt(tripPlan.getCreatedAt());
			dto.setImageUrl(imageUrl);
			dto.setTripPlanCourses(tripPlanCourses != null ? tripPlanCourses : new ArrayList<>());
	
			result.add(dto);
		}
	
		return result;
	}
	
	// MemberTripPlan 저장하기 -> TripPlan도 같이
	public void saveMemberTrip(TripSaveRequest request) {
		try {
			String imagePath = saveBase64Image(request.getMapImage());
			TripPlan tripPlan = new TripPlan();
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
	
			MemberTripPlan memberTripPlan = new MemberTripPlan();
			memberTripPlan.setMember(member);
			memberTripPlan.setTripPlan(tripPlan);
			memberTripPlan.setTitleOverride(request.getTitle());
			memberTripPlan.setPublicVisible(false);
			memberTripPlan.setStartDate(LocalDate.parse(request.getStartDate()));
			memberTripPlan.setEndDate(LocalDate.parse(request.getEndDate()));
			memberTripPlan.setCreatedAt(LocalDateTime.now());
			memberTripPlan.setCountPeople(request.getCountPeople());
			memberTripPlan.setCountPet(request.getCountPet());
			memberTripPlan.setImageUrl(imagePath);
			memberTripPlanMapper.insert(memberTripPlan);
	
		} catch (Exception e) {
			throw new RuntimeException("여행 저장 실패", e);
		}
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
}
