package com.wsplanning;

import com.wsplanning.webapp.CustomizeLogoutSuccessHandler;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;

import javax.servlet.http.HttpSession;

/**
 * Created by ThuyetLV
 */
@Configuration
@EnableWebSecurity
@EnableGlobalMethodSecurity(prePostEnabled = true, securedEnabled = true)
public class SecurityConfig extends WebSecurityConfigurerAdapter {

  @Autowired
  private HttpSession session;

  @Autowired
  private CustomAuthenticationProvider customAuthenticationProvider;
  @Autowired
  CustomizeLogoutSuccessHandler customizeLogoutSuccessHandler;

  @Override
  protected void configure(AuthenticationManagerBuilder auth) throws Exception {
    auth
        .authenticationProvider(this.customAuthenticationProvider);
  }


  @Override
  protected void configure(HttpSecurity http) throws Exception {
    http.csrf().disable();//TODO review

    http.authorizeRequests()
        .antMatchers("/assets/**", "/wsplanning/**", "/login",
            "/users/get-existed-email", "/users/forgot-password-with-email",
            "/changeForgotPassword", "/changeForgotPasswordConfirm",
            "/change-password", "/change-password-with-token", "/site/getAll", "/language/getAll","/site/getMenuAuth","/test").permitAll()
        .anyRequest().authenticated()
        .and()
        .formLogin()
        .loginPage("/login")
        .successHandler(successHandler())
        .permitAll()
        .and()
        .exceptionHandling().accessDeniedPage("/403")
        .and()
        .logout()
//        .logoutSuccessHandler(customizeLogoutSuccessHandler)
        .permitAll();

  }

  @Bean
  public BCryptPasswordEncoder passwordEncoder() {
    BCryptPasswordEncoder bCryptPasswordEncoder = new BCryptPasswordEncoder();
    return bCryptPasswordEncoder;
  }

  @Bean
  public AuthenticationSuccessHandler successHandler() {
    System.out.printf("AuthenticationSuccessHandler successHandler");
    UmpAuthSuccessHandler successHandler = new UmpAuthSuccessHandler("/");
    return successHandler;
  }
}
