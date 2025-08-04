package com.ssdam.tripPaw.nft;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class NFTDto {
    private String tokenId;
    private String tokenURI;
    private String previewURL;
    private String metadataUrl;
}
