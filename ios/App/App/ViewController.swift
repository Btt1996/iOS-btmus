import UIKit
import Capacitor

class ViewController: CAPBridgeViewController {
    override open func capacitorDidLoad() {
        super.capacitorDidLoad()
        // Register the native AudioBridgePlugin for background audio and lock screen controls
        bridge?.registerPluginType(AudioBridgePlugin.self)
    }
}
