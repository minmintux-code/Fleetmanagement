package com.fleetmanagement.config;

import com.fleetmanagement.entity.User;
import com.fleetmanagement.repository.UserRepository;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Collections;
import java.util.Optional;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtTokenProvider jwtTokenProvider;
    private final UserRepository userRepository;

    public JwtAuthenticationFilter(JwtTokenProvider jwtTokenProvider, UserRepository userRepository) {
        this.jwtTokenProvider = jwtTokenProvider;
        this.userRepository = userRepository;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {
        try {
            String jwt = getJwtFromRequest(request);

            if (StringUtils.hasText(jwt) && jwtTokenProvider.validateToken(jwt)) {
                String username = jwtTokenProvider.getUsernameFromToken(jwt);
                String tokenRole = jwtTokenProvider.getRoleFromToken(jwt);

                if (StringUtils.hasText(username)) {
                    Optional<User> userOpt = userRepository.findByUsernameOrEmail(username, username);
                    if (userOpt.isPresent()) {
                        User user = userOpt.get();
                        String role = (tokenRole != null && !tokenRole.trim().isEmpty()) ? tokenRole : user.getRole();
                        if (role == null || role.trim().isEmpty()) {
                            role = "USER";
                        }
                        String authorityRole = role.toUpperCase();
                        if (!authorityRole.startsWith("ROLE_")) {
                            authorityRole = "ROLE_" + authorityRole;
                        }

                        UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
                                user,
                                null,
                                Collections.singletonList(new SimpleGrantedAuthority(authorityRole))
                        );
                        authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                        SecurityContextHolder.getContext().setAuthentication(authentication);
                    }
                }
            }
        } catch (io.jsonwebtoken.ExpiredJwtException ex) {
            request.setAttribute("jwtError", "TOKEN_EXPIRED");
            logger.debug("JWT token is expired", ex);
        } catch (Exception ex) {
            request.setAttribute("jwtError", "TOKEN_INVALID");
            logger.debug("Could not set user authentication in security context", ex);
        }

        filterChain.doFilter(request, response);
    }

    private String getJwtFromRequest(HttpServletRequest request) {
        String bearerToken = request.getHeader("Authorization");
        if (StringUtils.hasText(bearerToken) && bearerToken.startsWith("Bearer ")) {
            return bearerToken.substring(7);
        }
        return null;
    }
}
