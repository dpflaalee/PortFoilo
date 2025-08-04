package com.ssdam.tripPaw.init;

import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Component;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class InitAllRunner implements ApplicationRunner {

    private final TemplateDataInitializer templateDataInitializer;
    private final PlaceInitializer placeInitializer;
    private final BadgeInitializer badgeInitializer;
    private final SealInitializer sealInitializer;

    @Override
    public void run(ApplicationArguments args) throws Exception {
        if (!args.containsOption("initAll")) {
            System.out.println("[INFO] initAll 인자 없음 → 초기화 생략");
            return;
        }

        System.out.println("[INIT] === 초기화 순차 실행 시작 ===");

        badgeInitializer.run(args.getSourceArgs());
        
        templateDataInitializer.run(args.getSourceArgs());

        placeInitializer.run(args);

        sealInitializer.run();

        System.out.println("[INIT] === 초기화 완료 ===");
    }
}

