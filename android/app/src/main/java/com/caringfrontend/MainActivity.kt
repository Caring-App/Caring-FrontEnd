package com.caringfrontend

import android.os.Bundle
import com.facebook.react.ReactActivity
import com.facebook.react.ReactActivityDelegate
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint.fabricEnabled
import com.facebook.react.defaults.DefaultReactActivityDelegate
import dev.matinzd.healthconnect.permissions.HealthConnectPermissionDelegate

class MainActivity : ReactActivity() {

  /**
   * Returns the name of the main component registered from JavaScript. This is used to schedule
   * rendering of the component.
   */
  override fun getMainComponentName(): String = "CaringFrontEnd"

  override fun onCreate(savedInstanceState: Bundle?) {
    // react-native-screens: 저장된 화면 상태를 복원하면 크래시가 날 수 있어 null로 넘김(라이브러리 권장)
    super.onCreate(null)
    // Health Connect 걸음 수 권한 요청 결과를 받기 위해 필요(react-native-health-connect)
    HealthConnectPermissionDelegate.setPermissionDelegate(this)
  }

  /**
   * Returns the instance of the [ReactActivityDelegate]. We use [DefaultReactActivityDelegate]
   * which allows you to enable New Architecture with a single boolean flags [fabricEnabled]
   */
  override fun createReactActivityDelegate(): ReactActivityDelegate =
      DefaultReactActivityDelegate(this, mainComponentName, fabricEnabled)
}
