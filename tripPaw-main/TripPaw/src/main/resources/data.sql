create table IF NOT EXISTS member(
	id bigint  auto_increment primary key,
    username varchar(50) not null,
    password varchar(200) not null,
    nickname varchar(20) not null,
    email varchar(255) not null UNIQUE,
    roadAddress varchar(255) not null,
    jibunAddress varchar(255) not null,
    namujiAddress varchar(255) not null,
    role varchar(20) not null,
    provider varchar(20) not null,
    createdAt datetime default now()
);


insert IGNORE into member (username,password,nickname,email,roadAddress,jibunAddress,namujiAddress,userRole,provider)
values('admin','$2a$12$IzrS4K6sNGAsReeCH6YQ9.jQ9Nlz/G4wO3/rMJ/6O5NPfPngzGZEK','admin','admin@naver.com','경기 성남시 분당구 판교역로 166 (카카오 판교 아지트)','경기 성남시 분당구 백현동 532','102동','ADMIN','');
insert IGNORE into member (username,password,nickname,email,roadAddress,jibunAddress,namujiAddress,userRole,provider)
values('test1','$2a$12$IzrS4K6sNGAsReeCH6YQ9.jQ9Nlz/G4wO3/rMJ/6O5NPfPngzGZEK','test1','test1@naver.com','경기 성남시 분당구 판교역로 166 (카카오 판교 아지트)','경기 성남시 분당구 백현동 532','102동','MEMBER','');
insert IGNORE into member (username,password,nickname,email,roadAddress,jibunAddress,namujiAddress,userRole,provider)
values('test2','$2a$12$IzrS4K6sNGAsReeCH6YQ9.jQ9Nlz/G4wO3/rMJ/6O5NPfPngzGZEK','test2','test2@naver.com','경기 성남시 분당구 판교역로 166 (카카오 판교 아지트)','경기 성남시 분당구 백현동 532','102동','MEMBER','');
insert IGNORE into member (username,password,nickname,email,roadAddress,jibunAddress,namujiAddress,userRole,provider)
values('test3','$2a$12$IzrS4K6sNGAsReeCH6YQ9.jQ9Nlz/G4wO3/rMJ/6O5NPfPngzGZEK','test3','test3@naver.com','경기 성남시 분당구 판교역로 166 (카카오 판교 아지트)','경기 성남시 분당구 백현동 532','102동','MEMBER','');

#password = 1234