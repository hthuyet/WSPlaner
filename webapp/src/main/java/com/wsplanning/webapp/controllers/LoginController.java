package com.wsplanning.webapp.controllers;

import com.wsplanning.CustomAuthenticationProvider;
import com.wsplanning.webapp.clients.ASMasterClient;

import org.apache.commons.codec.binary.Base64;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

import java.io.IOException;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

@Controller
public class LoginController {

    @Autowired
    protected ASMasterClient siteClient;

    @Autowired
    private HttpSession session;

    @GetMapping("/login")
    public String login(HttpServletRequest request) {
        // String SiteId = request.getParameter("siteId");
        // String SiteId = request.getParameter("siteId");
        // String UserId = request.get("username");
        // String user_encoded = Base64.encodeBase64String(UserId.getBytes());
        // String pass_encoded = Base64.encodeBase64String(Password.getBytes());
        // request.removeAttribute("username");
        // request.removeAttribute("password");
        // request.setAttribute("username", user_encoded);
        // request.setAttribute("password", pass_encoded);


        String token = (String) session.getAttribute(CustomAuthenticationProvider.SESSION_TOKEN);
        if (token != null && !StringUtils.isBlank(token)) {
            return "redirect:/";
        }
        return "login";
    }
    
}
