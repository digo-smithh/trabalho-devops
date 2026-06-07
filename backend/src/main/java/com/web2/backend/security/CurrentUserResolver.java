package com.web2.backend.security;

import com.web2.backend.model.User;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.core.MethodParameter;
import org.springframework.stereotype.Component;
import org.springframework.web.bind.support.WebDataBinderFactory;
import org.springframework.web.context.request.NativeWebRequest;
import org.springframework.web.method.support.HandlerMethodArgumentResolver;
import org.springframework.web.method.support.ModelAndViewContainer;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;

@Component
public class CurrentUserResolver implements HandlerMethodArgumentResolver {

    @Override
    public boolean supportsParameter(MethodParameter parameter) {
        return parameter.hasParameterAnnotation(CurrentUser.class)
                && User.class.isAssignableFrom(parameter.getParameterType());
    }

    @Override
    public Object resolveArgument(MethodParameter parameter,
                                  ModelAndViewContainer mavContainer,
                                  NativeWebRequest webRequest,
                                  WebDataBinderFactory binderFactory) {
        HttpServletRequest req = webRequest.getNativeRequest(HttpServletRequest.class);
        Object userAttr = req != null ? req.getAttribute(AuthFilter.CURRENT_USER_ATTR) : null;
        CurrentUser annotation = parameter.getParameterAnnotation(CurrentUser.class);
        if (userAttr == null) {
            if (annotation != null && annotation.required()) {
                throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Sessão obrigatória");
            }
            return null;
        }
        return userAttr;
    }
}
