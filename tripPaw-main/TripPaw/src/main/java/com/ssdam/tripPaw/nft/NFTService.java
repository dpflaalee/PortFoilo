package com.ssdam.tripPaw.nft;

import java.math.BigInteger;
import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;
import org.web3j.abi.FunctionEncoder;
import org.web3j.abi.TypeReference;
import org.web3j.abi.datatypes.Address;
import org.web3j.abi.datatypes.Function;
import org.web3j.abi.datatypes.Utf8String;
import org.web3j.abi.datatypes.generated.Uint256;
import org.web3j.protocol.Web3j;
import org.web3j.protocol.core.DefaultBlockParameterName;
import org.web3j.protocol.core.methods.request.Transaction;
import org.web3j.protocol.core.methods.response.EthCall;
import org.web3j.utils.Numeric;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.ssdam.tripPaw.domain.NftMetadata;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class NFTService {

    private final Web3j web3j;
    private final NftMetadataMapper nftMetadataMapper;
    private final MemberNftMapper memberNftMapper;
    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper objectMapper = new ObjectMapper();
    
    


    // OpenAI API 키 (환경변수 등에서 불러오세요)
//    @Value("${openai.api.key}")
    private String openAiApiKey;
    private final String openAiApiUrl = "https://api.openai.com/v1/chat/completions";

    // 블록체인에서 보유 NFT 조회
    public List<NFTDto> getNFTs(String contractAddress, String walletAddress) throws Exception {
        Function balanceOf = new Function(
                "balanceOf",
                List.of(new Address(walletAddress)),
                List.of(new TypeReference<Uint256>() {})
        );
        String encoded = FunctionEncoder.encode(balanceOf);
        EthCall call = web3j.ethCall(
                Transaction.createEthCallTransaction(walletAddress, contractAddress, encoded),
                DefaultBlockParameterName.LATEST
        ).send();

        BigInteger balance = Numeric.decodeQuantity(call.getValue());
        List<NFTDto> result = new ArrayList<>();

        for (int i = 0; i < balance.intValue(); i++) {
            // 1. tokenOfOwnerByIndex
            Function tokenOfOwnerByIndex = new Function(
                    "tokenOfOwnerByIndex",
                    List.of(new Address(walletAddress), new Uint256(i)),
                    List.of(new TypeReference<Uint256>() {})
            );
            EthCall indexCall = web3j.ethCall(
                    Transaction.createEthCallTransaction(walletAddress, contractAddress, FunctionEncoder.encode(tokenOfOwnerByIndex)),
                    DefaultBlockParameterName.LATEST
            ).send();

            BigInteger tokenId = Numeric.decodeQuantity(indexCall.getValue());

            // 2. tokenURI
            Function tokenURI = new Function(
                    "tokenURI",
                    List.of(new Uint256(tokenId)),
                    List.of(new TypeReference<Utf8String>() {})
            );
            EthCall uriCall = web3j.ethCall(
                    Transaction.createEthCallTransaction(walletAddress, contractAddress, FunctionEncoder.encode(tokenURI)),
                    DefaultBlockParameterName.LATEST
            ).send();

            String uriHex = uriCall.getValue();
            byte[] bytes = Numeric.hexStringToByteArray(uriHex);
            String rawUri = new String(bytes, StandardCharsets.UTF_8).trim().replaceAll("\u0000", "");
            if (rawUri.startsWith("I")) {
                rawUri = rawUri.substring(1);
            }

            // IPFS to HTTPS 변환
            String metadataUrl = rawUri.replace("ipfs://", "https://ipfs.io/ipfs/");

            // 메타데이터 JSON 가져와서 image 필드 파싱
            String imageUrl = metadataUrl;
            try {
                ResponseEntity<String> response = restTemplate.getForEntity(metadataUrl, String.class);
                if (response.getStatusCode().is2xxSuccessful()) {
                    String jsonString = response.getBody();
                    JsonNode root = objectMapper.readTree(jsonString);
                    if (root.has("image")) {
                        String imageIpfs = root.get("image").asText();
                        if (imageIpfs.startsWith("ipfs://")) {
                            imageUrl = imageIpfs.replace("ipfs://", "https://cloudflare-ipfs.com/ipfs/");
                        } else {
                            imageUrl = imageIpfs;
                        }
                    }
                }
            } catch (Exception e) {
                System.out.println("메타데이터 JSON 파싱 실패, tokenId=" + tokenId + ", url=" + metadataUrl);
                e.printStackTrace();
            }

            result.add(new NFTDto(tokenId.toString(), metadataUrl, imageUrl, imageUrl));
        }

        return result;
    }

    // AI를 통해 NFT 제목 생성 (OpenAI GPT API 호출)
    private String generateTitleByAI(String metadataUrl) {
        if (openAiApiKey == null || openAiApiKey.isEmpty()) {
            System.out.println("OpenAI API 키가 설정되어 있지 않습니다.");
            return null;
        }

        String prompt = "Suggest one short, cute, single English word for a dog or cat themed NFT coupon. Only return the word.";
        int retryCount = 5;
        for (int i = 0; i < retryCount; i++) {
            String title = generateTitleFromAI(prompt);
            if (title != null && !nftMetadataMapper.existsByTitle(title)) {
                return title;
            }
        }
        return "Token-" + System.currentTimeMillis(); // fallback
    }

    private String generateTitleFromAI(String prompt) {
        Map<String, Object> requestBody = Map.of(
            "model", "gpt-3.5-turbo",
            "messages", List.of(Map.of("role", "user", "content", prompt)),
            "max_tokens", 20
        );

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(openAiApiKey);

        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);

        try {
            ResponseEntity<Map> response = restTemplate.postForEntity(openAiApiUrl, entity, Map.class);
            if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                Map<String, Object> body = response.getBody();
                List<Map<String, Object>> choices = (List<Map<String, Object>>) body.get("choices");
                if (choices != null && !choices.isEmpty()) {
                    Map<String, Object> message = (Map<String, Object>) choices.get(0).get("message");
                    if (message != null) {
                        return ((String) message.get("content")).trim();
                    }
                }
            }
        } catch (Exception e) {
            System.out.println("AI 제목 생성 실패: " + e.getMessage());
        }
        return null;
    }


    // 동기화: 블록체인에서 NFT 가져와 DB 저장/업데이트 (AI 제목 생성 추가)
    public List<NftMetadata> syncTokensToDb(String contractAddress, String walletAddress) throws Exception {
        List<NFTDto> nfts = getNFTs(contractAddress, walletAddress);
        List<NftMetadata> savedList = new ArrayList<>();

        for (NFTDto nft : nfts) {
            try {
                Long tokenId = Long.parseLong(nft.getTokenId());
                String imageUrl = nft.getPreviewURL();

                // AI 제목 생성 호출
                String aiTitle = generateTitleByAI(nft.getMetadataUrl());
                String title = (aiTitle != null && !aiTitle.isBlank()) ? aiTitle : "Token #" + tokenId;

                NftMetadata existing = nftMetadataMapper.findByTokenId(tokenId);
                if (existing == null) {
                    NftMetadata newMeta = new NftMetadata();
                    newMeta.setTokenId(tokenId);
                    newMeta.setTitle(title);
                    newMeta.setImageUrl(imageUrl);
                    newMeta.setPointValue(0);
                    newMeta.setIssuedAt(LocalDateTime.now());
                    nftMetadataMapper.insert(newMeta);
                    savedList.add(newMeta);
                } else {
                    existing.setImageUrl(imageUrl);
                    existing.setTitle(title);
                    existing.setPointValue(0);
                    nftMetadataMapper.update(existing);
                    savedList.add(existing);
                }
            } catch (Exception e) {
                System.out.println("Error syncing NFT with tokenId: " + nft.getTokenId());
                e.printStackTrace();
                throw new RuntimeException("Failed to sync NFT: " + nft.getTokenId(), e);
            }
        }
        return savedList;
    }

    // NFT 템플릿 + 발급 여부 반환
    public List<Map<String, Object>> getAllNftMetadata() {
        List<NftMetadata> metadataList = nftMetadataMapper.findAll();
        List<Map<String, Object>> result = new ArrayList<>();

        for (NftMetadata meta : metadataList) {
            Map<String, Object> map = new HashMap<>();
            map.put("id", meta.getId());
            map.put("title", meta.getTitle());
            map.put("imageUrl", meta.getImageUrl());
            map.put("tokenId", meta.getTokenId());
            map.put("pointValue", meta.getPointValue());
            map.put("issuedAt", meta.getIssuedAt());

            boolean isIssued = memberNftMapper.existsByNftMetadataId(meta.getId());
            map.put("issued", isIssued);

            result.add(map);
        }

        return result;
    }

    // NFT 메타데이터 수정
    public void updateNftMetadata(Long id, Map<String, Object> updates) {
        NftMetadata nft = nftMetadataMapper.findById(id);
        if (nft == null) throw new RuntimeException("해당 NFT 없음: " + id);

        if (updates.containsKey("pointValue")) {
            nft.setPointValue((Integer) updates.get("pointValue"));
        }
        nftMetadataMapper.update(nft);
    }

    // NFT 메타데이터 삭제
    @Transactional
    public void deleteNftMetadataAndUsedCoupons(Long nftMetadataId) {
        int unusedCount = memberNftMapper.countUnusedByMetadataId(nftMetadataId);

        if (unusedCount > 0) {
            throw new IllegalStateException("사용하지 않은 쿠폰이 존재하므로 삭제할 수 없습니다.");
        }
        
        // used 여부와 관계없이 모두 soft delete 처리
        memberNftMapper.softDeleteAllByMetadataId(nftMetadataId);

        nftMetadataMapper.softDelete(nftMetadataId);
    }
    
    // 관리자 강제 삭제
    @Transactional
    public void forceDeleteNftMetadata(Long nftMetadataId) {
        // 사용 여부와 관계없이 soft delete 처리
        memberNftMapper.softDeleteAllByMetadataId(nftMetadataId);
        nftMetadataMapper.softDelete(nftMetadataId);
    }
}
