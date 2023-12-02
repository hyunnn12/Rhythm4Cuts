package com.b109.rhythm4cuts.config;

import com.b109.rhythm4cuts.config.jwt.TokenProvider;
import java.util.*;

import com.fasterxml.jackson.databind.ObjectMapper;
import io.jsonwebtoken.ExpiredJwtException;
import lombok.RequiredArgsConstructor;
import lombok.val;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.oauth2.jwt.JwtException;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.Arrays;
import java.util.List;

@RequiredArgsConstructor
@Component
public class TokenAuthenticationFilter extends OncePerRequestFilter {
    private final TokenProvider tokenProvider;
    private final UserDetailsService userDetailsService;
    private final ObjectMapper mapper;
    private final static String HEADER_AUTHORIZATION = "Authorization";
    private final static String TOKEN_PREFIX = "Bearer ";
    private final List<String> excludedUrlPatterns = Arrays.asList(
            "/member/reissue",
            "/member/login",
            "/member/register",
            "/member/mail",
            "/member/mailcheck",
            "/member/nickname",
            "/member/pw",
            "/stomp/chat",
            "/ranking/song",
            "/ranking/user"
    );

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        try {
            //요청 경로 추출
            String path = request.getServletPath();
            //HTTP 메소드 추출
            String httpMethod = request.getMethod();
            //토큰 검증에서 제외할 url 리스트
            boolean isExcludedUrl = excludedUrlPatterns.stream().anyMatch(path::startsWith);

            //가져온 토큰이 유요한지 확인하고, 유효한 때는 인증 정보 설정
            if (!isExcludedUrl || (httpMethod.equals("PATCH"))) {
                //요청 헤더의 Authorization(Bearer 액세스 토큰의 키 값) 키의 값 조회
                String authorizationHeader = request.getHeader(HEADER_AUTHORIZATION);
                //가져온 값에서 접두사("Bearer ") 제거
                String token = getAccessToken(authorizationHeader);

                //유효한가? (만료 체크 X)
                boolean isTokenValid = tokenProvider.validToken(token);

                //만료 체크
                if (tokenProvider.isTokenExpired(token)) {
                    throw new JwtException("Expired token");
                }
                //유효 체크(분기 진입 시 유효한 토큰)
                else if (StringUtils.hasText(token) && isTokenValid) {
                    String email = tokenProvider.getSubject(token);
                    UserDetails userDetails = userDetailsService.loadUserByUsername(email);

                    UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(userDetails, null, null);
                    authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

                    logger.info("authenticated user " + email + ", setting security context");

                    SecurityContextHolder.getContext().setAuthentication(authentication);
                }
                //유효 X, 만료 O인 경우 예외 던짐
                else {
                    throw new JwtException("Invalid token");
                }
            }

            filterChain.doFilter(request, response);
        } catch (Exception e) {//oauth2.jwtexception
            //에러 메세지 생성 및 응답
            Map<String, Object> errorDetails = new HashMap<>();

            errorDetails.put("message", e.getMessage());

            response.setStatus(HttpStatus.UNAUTHORIZED.value());

            response.setContentType(MediaType.APPLICATION_JSON_VALUE);

            mapper.writeValue(response.getWriter(), errorDetails);
        }
    }

    //액세스 토큰(Bearer ~~)에서 "Bearer " 부분 제거하고 토큰 값만 남겨주는 메서드
    private String getAccessToken(String authorizationHeader) {
        if (authorizationHeader != null && authorizationHeader.startsWith(TOKEN_PREFIX)) {
            return authorizationHeader.substring(TOKEN_PREFIX.length());
        }

        return null;
    }
}
