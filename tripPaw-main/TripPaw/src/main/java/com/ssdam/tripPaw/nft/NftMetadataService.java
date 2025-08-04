package com.ssdam.tripPaw.nft;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.ssdam.tripPaw.domain.NftMetadata;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class NftMetadataService {

    private final NftMetadataMapper nftMetadataMapper;

    public List<NftMetadata> findAll() {
        return nftMetadataMapper.findAll();
    }

    public NftMetadata findById(Long id) {
        return nftMetadataMapper.findById(id);
    }

    @Transactional
    public void create(NftMetadata nftMetadata) {
        nftMetadataMapper.insert(nftMetadata);
    }

    @Transactional
    public void update(NftMetadata nftMetadata) {
        nftMetadataMapper.update(nftMetadata);
    }

    @Transactional
    public void delete(Long id) {
        nftMetadataMapper.delete(id);
    }
    
    // nft 발급
    public NftMetadata findNextAvailableMetadata() {
        return nftMetadataMapper.findFirstUnused();
    }
}
