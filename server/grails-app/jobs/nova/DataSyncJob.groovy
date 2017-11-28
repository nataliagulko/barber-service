package nova

import com.h2osis.auth.Role
import com.h2osis.auth.User
import com.h2osis.auth.UserRole
import com.h2osis.utils.DataSyncService


class DataSyncJob {

    DataSyncService dataSyncService
    static triggers = {
        simple repeatInterval: 5000l * 5 // execute job once in 25 seconds
    }

    def execute() {
        List<UserRole> mastersByRole = UserRole.findAllByRole(Role.findByAuthority("ROLE_ADMIN"))
        List<User> masters = mastersByRole?.user
        masters?.each { it ->
            dataSyncService.syncMaxTimes(it, 90)
            dataSyncService.deleteOldSM(it)
        }

    }
}
