import java.nio.file.*;
import java.util.*;

public class UpdateControllers {
    public static void main(String[] args) throws Exception {
        String dir = "c:/fleet/Fleetmanagement/src/main/java/com/fleetmanagement/controller";
        List<String> files = Arrays.asList(
            "DriverController.java", "TripController.java", "FuelController.java",
            "MaintenanceController.java", "ExpenseController.java", "CustomerController.java",
            "RentalController.java", "NotificationController.java", "AnalyticsController.java"
        );

        for (String f : files) {
            Path p = Paths.get(dir, f);
            if (!Files.exists(p)) continue;

            String content = new String(Files.readAllBytes(p));

            if (!content.contains("com.fleetmanagement.config.AuthContext")) {
                content = content.replace("import org.springframework", "import com.fleetmanagement.config.AuthContext;\nimport org.springframework");
            }

            content = content.replace(".findByIsDeletedFalse()", ".findByOwnerIdAndIsDeletedFalse(AuthContext.getUserId())");
            
            // For findById(id) -> findByIdAndOwnerIdAndIsDeletedFalse(id, AuthContext.getUserId())
            // Need to match any repository variable (e.g. driverRepository, vehicleRepository) followed by .findById(...)
            content = content.replaceAll("([a-zA-Z0-9_]+Repository)\\.findById\\((id)\\)", "$1.findByIdAndOwnerIdAndIsDeletedFalse($2, AuthContext.getUserId())");
            
            // For cross-repository calls in the same controller:
            // e.g. vehicleRepository.findById(dto.getVehicleId()) -> findByIdAndOwnerIdAndIsDeletedFalse
            content = content.replaceAll("([a-zA-Z0-9_]+Repository)\\.findById\\((dto\\.get[a-zA-Z0-9_]+Id\\(\\))\\)", "$1.findByIdAndOwnerIdAndIsDeletedFalse($2, AuthContext.getUserId())");

            // NotificationController specific
            content = content.replace(".findByIsDeletedFalseOrderByTimestampDesc()", ".findByOwnerIdAndIsDeletedFalseOrderByTimestampDesc(AuthContext.getUserId())");

            // AnalyticsController specific (using countByIsDeletedFalse or findByIsDeletedFalse)
            content = content.replace(".countByIsDeletedFalse()", ".countByOwnerIdAndIsDeletedFalse(AuthContext.getUserId())");
            content = content.replace(".countByStatusAndIsDeletedFalse", ".countByStatusAndOwnerIdAndIsDeletedFalse");
            
            Files.write(p, content.getBytes());
            System.out.println("Updated " + f);
        }
    }
}
