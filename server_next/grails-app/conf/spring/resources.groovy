import com.h2osis.auth.UserPasswordEncoderListener
import com.h2osis.barber.auth.NovaBearerTokenAuthenticationFailureHandler

// Place your Spring DSL code here
beans = {
    UserPasswordEncoderListener(UserPasswordEncoderListener)
    restAuthenticationFailureHandler(NovaBearerTokenAuthenticationFailureHandler)
}
