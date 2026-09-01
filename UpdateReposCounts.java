import java.nio.file.*;
import java.util.*;

public class UpdateReposCounts {
    public static void main(String[] args) throws Exception {
        String dir = "c:/fleet/Fleetmanagement/src/main/java/com/fleetmanagement/repository";
        
        List<String> files = Arrays.asList(
            "VehicleRepository.java", "DriverRepository.java", "TripRepository.java", 
            "ExpenseRepository.java", "DashboardStatisticRepository.java", "NotificationRepository.java"
        );

        for (String f : files) {
            Path p = Paths.get(dir, f);
            if (!Files.exists(p)) continue;

            String content = new String(Files.readAllBytes(p));

            content = content.replace("long countByIsDeletedFalse();", "long countByIsDeletedFalse();\n    long countByOwnerIdAndIsDeletedFalse(Long ownerId);");
            content = content.replace("long countByStatusAndIsDeletedFalse(String status);", "long countByStatusAndIsDeletedFalse(String status);\n    long countByStatusAndOwnerIdAndIsDeletedFalse(String status, Long ownerId);");
            
            // For NotificationRepository
            content = content.replace("List<Notification> findByIsDeletedFalseOrderByTimestampDesc();", "List<Notification> findByIsDeletedFalseOrderByTimestampDesc();\n    List<Notification> findByOwnerIdAndIsDeletedFalseOrderByTimestampDesc(Long ownerId);");
            
            Files.write(p, content.getBytes());
            System.out.println("Updated " + f);
        }
    }
}
