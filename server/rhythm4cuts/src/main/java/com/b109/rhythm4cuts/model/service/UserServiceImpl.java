package com.b109.rhythm4cuts.model.service;

import com.b109.rhythm4cuts.config.jwt.TokenProvider;
import com.b109.rhythm4cuts.model.domain.Category;
import com.b109.rhythm4cuts.model.domain.PointLog;
import com.b109.rhythm4cuts.model.domain.ProfileImage;
import com.b109.rhythm4cuts.model.domain.User;
import com.b109.rhythm4cuts.model.dto.*;
import com.b109.rhythm4cuts.model.repository.CategoryRepository;
import com.b109.rhythm4cuts.model.repository.LogRepository;
import com.b109.rhythm4cuts.model.repository.ProfileImageRepository;
import com.b109.rhythm4cuts.model.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.serializer.Jackson2JsonRedisSerializer;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.oauth2.jwt.JwtException;
import org.springframework.stereotype.Service;
import org.springframework.util.ObjectUtils;

import javax.transaction.Transactional;
import java.util.*;

import java.security.SecureRandom;
import java.time.Duration;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.concurrent.TimeUnit;

import static com.b109.rhythm4cuts.model.service.Utils.dtoSetter;
import static com.b109.rhythm4cuts.model.service.Utils.getRandomString;

@RequiredArgsConstructor
@Service
@Transactional
public class UserServiceImpl implements UserService {
    private final UserRepository userRepository;
    private final ProfileImageRepository profileImageRepository;
    private final BCryptPasswordEncoder bCryptPasswordEncoder;
    private final JavaMailSender javaMailSender;
    private final TokenProvider tokenProvider;
    private final RedisTemplate redisTemplate;
    private final CategoryRepository categoryRepository;
    private final LogRepository logRepository;

    //id로 사용자 객체를 찾는 메서드
    public UserDto findById(int userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("id: " + userId + " 사용자를 찾을 수 없습니다."));

        UserDto userDto = Utils.dtoSetter(user);

        return userDto;
    }

    //중복 닉네임 존재 여부 메서드
    public boolean duplicateNickname(String nickname) {
        return (userRepository.findByNickname(nickname).isPresent())? true:false;
    }

    //닉네임으로 사용자 객체를 찾는 메서드
    public UserDto findByNickname(String nickname) {
        User user = userRepository.findByNickname(nickname)
                .orElseThrow(() -> new IllegalArgumentException("해당 닉네임을 가진 사용자가 존재하지 않습니다."));

        UserDto userDto = Utils.dtoSetter(user);

        return userDto;
    }

    //이메일로 사용자 객체를 찾는 메서드
    public UserDto findByEmail(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("해당 이메일을 가진 사용자가 존재하지 않습니다."));

        UserDto userDto = Utils.dtoSetter(user);

        return userDto;
    }

//    public static LocalDate fn_getDateOfBirth(String str1, String str2){
//        int divisionCode = Integer.parseInt(str2.substring(0, 1));
//        String dateOfBirth = null;
//        if(divisionCode == 1 || divisionCode == 2 || divisionCode == 5 || divisionCode == 6){
//            // 한국인 1900~, 외국인 1900~
//            dateOfBirth = "19"+str1;
//        }else if(divisionCode == 3 || divisionCode == 4 || divisionCode == 7 || divisionCode == 8){
//            // 한국인 2000~, 외국인 2000~
//            dateOfBirth = "20"+str1;
//        }else if(divisionCode == 9 || divisionCode == 0){
//            // 한국인 1800~
//            dateOfBirth = "18"+str1;
//        }
//
//        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyyMMdd");
//        LocalDate birthDate = LocalDate.parse(dateOfBirth, formatter);
//
//        return birthDate;
//    }

    //회원가입 및 회원 객체 DB 저장 메서드
    public String save(AddUserRequest dto) {
        User user = new User();
        user.setName(dto.getName());
        user.setEmail(dto.getEmail());
//        String prefix = dto.getSsn().split("-")[0], postfix = dto.getSsn().split("-")[1];
//        user.setBirthDate(fn_getDateOfBirth(prefix, postfix));

        user.setGender(dto.getGender());
        user.setPassword(bCryptPasswordEncoder.encode(dto.getPassword()));
        user.setNickname(dto.getNickname());

        ProfileImage profileImage = profileImageRepository.findByProfileImageSeq(Integer.valueOf(dto.getProfile_img_seq()))
                .orElseThrow(() -> new IllegalArgumentException("No profile image."));
        user.setProfileImage(profileImage);

        return userRepository.save(user).getEmail();
    }

    //포인트 반환 메서드
    public int getPoint(String email) {
        return userRepository.findByEmail(email).get().getPoint();
    }

    //프로필 이미지 반환 메서드
    public Integer getProfileImg(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException());

        Optional<Integer> profileImgSeq = Optional.of(user.getProfileImage().getProfileImageSeq());

        //null인 상황이 있으면 안되지만 일단 0으로 리턴
        return (profileImgSeq.isPresent())? profileImgSeq.get():0;
    }

    //프로필 사진 변경 메서드
    public void patchProfileImg(UpdateProfileImgDto dto) {
        User user = userRepository.findByEmail(dto.getEmail())
                .orElseThrow(() -> new IllegalArgumentException());

        ProfileImage profileImage = profileImageRepository.findByProfileImageSeq(dto.getProfileImageSeq())
                .orElseThrow(() -> new IllegalArgumentException("해당 프로필 이미지는 존재하지 않습니다."));

        user.setProfileImage(profileImage);

        userRepository.save(user);
    }

    //닉네임 변경 메서드
    public void updateNickname(UpdateUserNicknameDto dto) {
        User user = userRepository.findByEmail(dto.getEmail())
                .orElseThrow();

        user.setNickname(dto.getNickname());

        userRepository.save(user);
    }

    @Override
    public void updatePassword(UpdateUserPasswordDto dto) {
        User user = userRepository.findByEmail(dto.getEmail())
                .orElseThrow(() -> new IllegalArgumentException("해당 이메일을 가진 사용자가 존재하지 않습니다."));

        String newPassword = dto.getNewPassword();
        String oldPassword = dto.getOldPassword();
        String currentPassword = user.getPassword();

        if (!bCryptPasswordEncoder.matches(oldPassword, currentPassword)) throw new IllegalArgumentException("비밀번호가 틀렸습니다.");

        user.setPassword(bCryptPasswordEncoder.encode(newPassword));

        userRepository.save(user);
    }

    //비밀번호 변경 메서드
    public void updatePassword(String accessToken, UpdateUserPasswordDto dto) {
        if (!tokenProvider.validToken(accessToken)) throw new IllegalArgumentException();

        String email = tokenProvider.getSubject(accessToken);

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException());

        //새로 바꾸고 싶은 비밀번호(raw)
        String newPassword = dto.getNewPassword();
        //사용자가 입력한 이전 비밀번호(raw)
        String oldPassword = dto.getOldPassword();
        //데이터베이스에 저장된 비밀번호(encoded)
        String currentPassword = user.getPassword();

        //사용자가 입력한 이전 비밀번호가 현재 비밀번호와 일치하지 않는 경우
        if (!bCryptPasswordEncoder.matches(oldPassword, currentPassword)) throw new IllegalArgumentException();

        //비밀번호 조건 충족 여부 추가할 위치
        //ex) if (newPassword.length() == 0) throw new WrongPasswordFormatException();

        user.setPassword(bCryptPasswordEncoder.encode(newPassword));

        userRepository.save(user);
    }

    //로그인 메서드
    public UserDto login(LoginDto loginDto) {
        User user = userRepository.findByEmail(loginDto.getEmail())
                .orElseThrow(() -> new IllegalArgumentException());

        if (!bCryptPasswordEncoder.matches(loginDto.getPassword(), user.getPassword())) throw new IllegalArgumentException();

        user.setIsOnline(1); // 온라인 상태로 변경
        UserDto userDto = Utils.dtoSetter(user);

        return userDto;
    }

    //로그아웃 메서드(상태 변환)
    public void logout(LogoutDto logoutDto) {
        User user = userRepository.findByEmail(logoutDto.getEmail())
                .orElseThrow(() -> new IllegalArgumentException("해당 이메일을 가진 사용자가 존재하지 않습니다."));
        user.setIsOnline(0); // 오프라인 상태로 변경

        long expiryMilliSeconds = tokenProvider.getExpirationDateFromToken(logoutDto.getAccessToken()).getTime() - new Date().getTime();

        //유효시간만큼 액세스 토큰을 블랙리스트 상에서 유지
        if (expiryMilliSeconds > 0) redisTemplate.opsForValue().set(logoutDto.getAccessToken(), "access_token", expiryMilliSeconds, TimeUnit.MILLISECONDS);
    }

    //포인트 결제 메서드
    public long payPoints(PayDto payDto) {
        User user = userRepository.findByEmail(payDto.getEmail())
                .orElseThrow(() -> new IllegalArgumentException("해당 이메일을 가진 사용자가 존재하지 않습니다."));

        int userPoint = user.getPoint(), payPoints = payDto.getPayPoints();

        //가진 포인트보다 많이 결제하려면 예외 발생
        if (userPoint < payPoints) throw new IllegalArgumentException();

        user.setPoint(user.getPoint() - payDto.getPayPoints());

        //update
        userRepository.save(user);
        PointLogDto pointLogDto = new PointLogDto();
        pointLogDto.setUserSeq(user.getUserSeq());
        pointLogDto.setRemainPoint(user.getPoint());
        pointLogDto.setPointHistory(-payPoints);
        pointLogDto.setCategorySeq(1);
        setPointLog(pointLogDto);

        return user.getPoint();
    }

    //비밀번호 찾기 메서드 (SMTP 사용)
    public void findPassword(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("해당 이메일을 가진 사용자가 존재하지 않습니다."));

        //15 자리 임시 비밀번호 생성
        String tempPassword = getRandomString(15);

        user.setPassword(tempPassword);

        userRepository.save(user);
    }

    public MailDto createMailAndChangePassword(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("해당 이메일을 가진 사용자가 존재하지 않습니다."));

        String tempPassword = getRandomString(15);

        MailDto mailDto = new MailDto();
        mailDto.setAddress(new String[] {email});
        mailDto.setTitle("Rhythm4Cuts 임시 비밀번호 발급 안내 메일입니다.");
        mailDto.setContent("안녕하세요. Rhythm4Cuts 로그인을 위한 임시 비밀번호 발급드립니다. 회원님의 임시 비밀번호는 " + tempPassword + "입니다.");
        user.setPassword(bCryptPasswordEncoder.encode(tempPassword));

        userRepository.save(user);

        return mailDto;
    }

    public MailDto createMailAndCertificate(String email) {
        String tempCertification = getRandomString(15);

        //비밀번호 저장 기능 필요
        redisTemplate.opsForValue().set(email, tempCertification, Duration.ofMinutes(5).toMillis(), TimeUnit.MILLISECONDS);

        MailDto mailDto = new MailDto();
        mailDto.setAddress(new String[] {email});
        mailDto.setTitle("Rhythm4Cuts 인증번호 발급 안내 메일입니다.");
        mailDto.setContent("안녕하세요. Rhythm4Cuts 인증번호를 발급드립니다. 회원님의 임시 인증번호는 " + tempCertification + "입니다. 임시 비밀번호의 유효기간은 5분입니다.");

        return mailDto;
    }

    public void sendEmail(MailDto mailDto) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(mailDto.getAddress());
        message.setSubject(mailDto.getTitle());
        message.setText(mailDto.getContent());
        message.setFrom("dropice@naver.com");
        message.setReplyTo("dropice@naver.com");
        javaMailSender.send(message);
    }

    public boolean checkCertificate(CertificateDto certificateDto) {
        String redisCert = (String) redisTemplate.opsForValue().get(certificateDto.getEmail());
        boolean res = (redisCert.equals(certificateDto.getCertificate()))? true:false;

        if (res) redisTemplate.delete(certificateDto.getCertificate());

        return res;
    }

    public TokenResponse generateToken(UserDto userDto) {
        User user = userRepository.findByEmail(userDto.getEmail())
                .orElseThrow(() -> new IllegalArgumentException("해당 이메일을 가진 사용자가 존재하지 않습니다."));
        TokenResponse tokenResponse = tokenProvider.generateToken(userDto);
        Authentication authentication = tokenProvider.getAuthentication(tokenResponse.getAccessToken());

        // Redis 에 Refresh Token 저장
        redisTemplate.opsForValue().set("RT:" + tokenResponse.getAccessToken(), tokenResponse.getRefreshToken(), TokenProvider.refreshExpiredAt.toMillis(), TimeUnit.MILLISECONDS);

        return tokenResponse;
    }

    public TokenResponse reissueAuthenticationToken(TokenRequestDto tokenRequestDto) {
        // Refresh Token 블랙리스트, 만료, 유효성 체크
        if(!tokenProvider.validToken(tokenRequestDto.getRefreshToken())) {
            throw new IllegalArgumentException("잘못된 요청입니다. 다시 로그인해주세요.");
        }

        // Access Token 에 기술된 사용자 이름 가져오기
        //User user = userRepository.findByEmail(tokenRequestDto.getEmail()).orElseThrow(() -> new IllegalArgumentException("해당 이메일을 가진 사용자가 존재하지 않습니다."));
        User user = userRepository.findByEmail(tokenProvider.getSubject(tokenRequestDto.getRefreshToken())).orElseThrow(() -> new IllegalArgumentException("해당 이메일을 가진 사용자가 존재하지 않습니다."));

        UserDto userDto = dtoSetter(user);
        String redisATKKey = "RT:" + tokenRequestDto.getAccessToken();

        // Redis 에 저장된 Refresh Token 과 비교
        String refreshToken = (String) redisTemplate.opsForValue().get(redisATKKey);

        //레디스에서 기존 액세스 토큰(키)과 리프레쉬 토큰(밸류)를 삭제
        if (redisTemplate.hasKey(redisATKKey)) redisTemplate.delete(redisATKKey);
            //해당 토큰을 키로 가진 매핑이 없는데요? 이미 리프레쉬 한번하는데 쓴 액세스 토큰을 다시 보냈을 때 발생.
        else throw new JwtException("Invalid access token. Possible reason is the access token provided was previously used for refresh.");

        //RefreshToken이 없을 때 실행
        if(ObjectUtils.isEmpty(refreshToken)) {
            throw new IllegalArgumentException("액세스 토큰이 무효합니다. 다시 로그인해주세요.");
        }

        //Redis 리프레쉬 토큰과 요청에 담긴 리프레쉬 토큰의 일치 여부 확인
        if(!refreshToken.equals(tokenRequestDto.getRefreshToken())) {
            throw new IllegalArgumentException("Refresh Token 정보가 일치하지 않습니다.");
        }

        // 새로운 Access Token 발급
        final TokenResponse tokenResponse = tokenProvider.generateToken(userDto);
        tokenResponse.setRefreshToken(tokenRequestDto.getRefreshToken());

        try {
            //기존 토큰 블랙 리스트 등록
            long expiryMilliSeconds = tokenProvider.getExpirationDateFromToken(tokenRequestDto.getAccessToken()).getTime() - new Date().getTime();
            redisTemplate.opsForValue().set(tokenRequestDto.getAccessToken(), "access_token", expiryMilliSeconds, TimeUnit.MILLISECONDS);
        }catch (Exception e) {}

        redisTemplate.opsForValue().set("RT:" + tokenResponse.getAccessToken(), tokenResponse.getRefreshToken(), TokenProvider.refreshExpiredAt.toMillis(), TimeUnit.MILLISECONDS);

        return tokenResponse;
    }

    public List<ProfileImageDto> getProfileImage(List<String> imageIds) {
        String imageDirectory = "./profile/";
        List<ProfileImageDto> profileImageDtos = new ArrayList<>();

        if (imageIds == null || imageIds.size() == 0) {
            for(int i = 1; i <= 4; i++){
                imageIds.add(String.valueOf(i) + ".png");
            }
        }

        //ProfileImageDto를 만들어서 응답 리스트에 담는 과정
        for (String image : imageIds){
            try {

            } catch(Exception e) {

            }
        }

        return null;
    }

    @Override
    public String findNicknameById(int userSeq) {
        return userRepository.findByUserSeq(userSeq).getNickname();
    }

    public void setPointLog(PointLogDto pointLogDto) {
        User user = userRepository.findByUserSeq(pointLogDto.getUserSeq());
        Category category = categoryRepository.findByCode(pointLogDto.getCategorySeq());

        PointLog pointLog = new PointLog();

        pointLog.setUser(user);
        pointLog.setCategory(category);
        pointLog.setPointHistory(pointLogDto.getPointHistory());
        pointLog.setRemainPoint(pointLogDto.getRemainPoint());

        logRepository.save(pointLog);
    }

    public List<PointLogDto> getPointLogs(int userSeq) {
        User user = userRepository.findByUserSeq(userSeq);
        List<PointLog> logs = logRepository.findByUser(user);

        List<PointLogDto> logsDto = new ArrayList<>();
        logs.forEach((log)-> {
            logsDto.add(log.getPointLogDto());
        });

        return logsDto;
    }
}