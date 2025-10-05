package com.networkmodule

import android.view.Gravity
import android.widget.Toast
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.Promise
import org.json.JSONObject

class NativeModuleService(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {

    override fun getName(): String {
        return "AndroidModule" // This name will be used to call the module from JavaScript
    }

    @ReactMethod
    fun showToast(message: String, duration: Int) {
        // Append "Hello from Android Native!" to the message
        val finalMessage = "$message Hello from Android Native!"

        val toast = Toast.makeText(reactApplicationContext, finalMessage, duration)
        toast.setGravity(Gravity.CENTER,0,0)
        toast.show()
    }
    
    // Expose Kotlin data to React Native
    @ReactMethod
    fun getUserData(promise: Promise) {
        try {
            // Simulate fetching user data (you can fetch it from a database, API, etc.)
            val user = User(id = 1, name = "John Doe", email = "johndoe@example.com")

            // Convert Kotlin object to JSON
            val userJson = JSONObject()
            userJson.put("id", user.id)
            userJson.put("name", user.name)
            userJson.put("email", user.email)

            // Resolve the promise with the user JSON
            promise.resolve(userJson.toString())
        } catch (e: Exception) {
            promise.reject("ERROR", e.message)
        }
    }
}