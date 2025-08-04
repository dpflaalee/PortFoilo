package com.ssdam.tripPaw.pay;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.springframework.data.repository.query.Param;

import com.ssdam.tripPaw.domain.Pay;

@Mapper
public interface PayMapper {
	public Pay findById(Long id);
	public List<Pay> findAll();
	public int insert(Pay pay);
	public int updateByState(Pay pay);
	public int softDelete(Long id);
	public int softDeleteByGroupId(Long GroupId);
	public Pay findByReservId(Long reservId);
	public Pay findByImpUid(String impUid);
	public int updateStateByImpUid(@Param("impUid") String impUid, @Param("state") String state);
    public List<Pay> findByReservIds(List<Long> reservIds);
    public List<Pay> findByTripPlanId(Long tripPlanId);
}
