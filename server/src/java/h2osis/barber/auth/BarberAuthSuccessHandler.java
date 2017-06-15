package h2osis.barber.auth;

import com.h2osis.utils.BarberUtils;
import org.springframework.security.web.authentication.SavedRequestAwareAuthenticationSuccessHandler;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 * Created by esokolov on 20.09.2016.
 */
public class BarberAuthSuccessHandler
        extends SavedRequestAwareAuthenticationSuccessHandler {

    @Override
    protected String determineTargetUrl(HttpServletRequest request,
                                        HttpServletResponse response) {
        String uri = BarberUtils.determRedirectUrl();
        return uri != null ? uri : super.determineTargetUrl(request, response);
    }
}
