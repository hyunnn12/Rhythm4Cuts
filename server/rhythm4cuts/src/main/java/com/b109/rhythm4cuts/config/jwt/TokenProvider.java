package com.b109.rhythm4cuts.config.jwt;

import com.b109.rhythm4cuts.model.domain.User;
import com.b109.rhythm4cuts.model.dto.LoginDto;
import org.springframework.data.redis.core.Cursor;
import org.springframework.data.redis.core.RedisTemplate;
import com.b109.rhythm4cuts.model.dto.TokenResponse;
import com.b109.rhythm4cuts.model.dto.UserDto;
import io.jsonwebtoken.*;
import lombok.RequiredArgsConstructor;
import java.util.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.redis.core.ScanOptions;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.util.Collections;
import java.util.Date;
import java.util.Set;

@RequiredArgsConstructor
@Service
public class TokenProvider {
    private final JwtProperties jwtProperties;
    private final RedisTemplate redisTemplate;
    private final Logger logger = LoggerFactory.getLogger(this.getClass());
    public final static Duration accessExpiredAt = Duration.ofMinutes(30), refreshExpiredAt = Duration.ofDays(14);

    public TokenResponse generateToken(UserDto userDto) {
        Date now = new Date();

        return makeToken(new Date(now.getTime() + accessExpiredAt.toMillis()), new Date(now.getTime() + refreshExpiredAt.toMillis()), userDto);
    }

    //메서드 1. JWT 토큰 생성 메서드
    private TokenResponse makeToken(Date accessExpiry, Date refreshExpiry, UserDto userDto) {
        Date now = new Date();
        
        String accessToken = Jwts.builder()
                .setHeaderParam(Header.TYPE, Header.JWT_TYPE)
                .setIssuer(jwtProperties.getIssuer())
                .setIssuedAt(now)
                .setExpiration(accessExpiry)
                .setSubject(userDto.getEmail())
                //여기부터 공개 클레임
                .claim("id", userDto.getEmail())
                .signWith(SignatureAlgorithm.HS256, jwtProperties.getSecretKey())
                .compact();

        String refreshToken = Jwts.builder()
                .setIssuer(jwtProperties.getIssuer())
                .setIssuedAt(now)
                .setExpiration(refreshExpiry)
                .setSubject(userDto.getEmail())
                .claim("id", userDto.getEmail())
                .signWith(SignatureAlgorithm.HS256, jwtProperties.getSecretKey())
                .compact();

        return TokenResponse
                .builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .email(userDto.getEmail())
                .build();
    }

    //메서드 2. JWT 토큰(액세스/리프레쉬 둘 다) 유효성 검증 메서드
    //1. 토큰 클레임 체크, 2. 블랙리스트 여부, 3. 만료 여부 확인
    public boolean validToken(String token) {
        try{
            //Signature 불일치 시 403 반환하는 원인
            //클레임 파싱하는 코드 -> 문제 있으면 원인에 따라 예외 던짐
            Jwts.parser()
                    .setSigningKey(jwtProperties.getSecretKey())
                    .parseClaimsJws(token);

            //토큰의 블랙리스트 등록 여부 확인
//            ScanOptions options = ScanOptions.scanOptions().match(token).build();
//            Cursor cursor = redisTemplate.scan(options);
//
//            if (cursor.hasNext()) {
//                System.out.println(cursor.next());
//                throw new IllegalArgumentException("토큰이 블랙리스트에 등록되어 있습니다.");
//            }

            boolean isBlackListed  = ((String) redisTemplate.opsForValue().get(token) == null)? false : true;

            if (isBlackListed) {
                System.out.println("블랙리스트 등록된 ATK");
                throw new IllegalArgumentException("ATK is blacklisted.");
            }

            //토큰 만료 여부 확인
            if (isTokenExpired(token)) {
                System.out.println("토큰 만료");
                throw new IllegalArgumentException("Token is expired.");
            }

            //유효한 토큰
            return true;
        } catch(SecurityException | MalformedJwtException e) {
            logger.error("Invalid JWT signature");
            return false;
        } catch(UnsupportedJwtException e) {
            logger.error("Unsupported JWT token");
            return false;
        } catch(IllegalArgumentException | SignatureException e) {
            logger.error("JWT token is invalid");
            return false;
        }
    }

    //메서드 3. 토큰 기반으로 인증 정보를 가져오는 메서드
    public Authentication getAuthentication(String token) {
        Claims claims = getClaims(token);
        Set<SimpleGrantedAuthority> authorities = Collections.singleton(new SimpleGrantedAuthority("ROLE_USER"));

        return new UsernamePasswordAuthenticationToken(new org.springframework.security.core.userdetails.User(claims.getSubject(), "", authorities), token, authorities);
    }

    //메서드 4. 토큰 기반으로 유저 ID(이메일)를 가져오는 메서드
    public String getSubject(String token) {
        //Claims claims = getClaims(token);
        //return claims.get("id", String.class);
        return getClaims(token).getSubject();
    }

    public Date getExpirationDateFromToken(String token) throws ExpiredJwtException, SignatureException {
        return getClaims(token).getExpiration();
    }

    public Boolean isTokenExpired(String token) throws ExpiredJwtException, SignatureException {
        final Date expiration = getExpirationDateFromToken(token);
        return expiration.before(new Date());
    }

    //메서드 5. 클레임 조회 메서드
    private Claims getClaims(String token) throws ExpiredJwtException, SignatureException {
        return Jwts.parser()
                .setSigningKey(jwtProperties.getSecretKey())
                .parseClaimsJws(token)
                .getBody();
    }
}