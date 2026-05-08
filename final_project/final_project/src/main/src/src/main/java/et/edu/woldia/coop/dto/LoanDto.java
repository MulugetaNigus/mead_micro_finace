package et.edu.woldia.coop.dto;

import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;

/**
 * DTO for Loan entity.
 */
@Data
public class LoanDto {
    private UUID id;
    private UUID memberId;
    private UUID applicationId;
    private BigDecimal principalAmount;
    private BigDecimal interestRate;
    private Integer durationMonths;
    private BigDecimal outstandingPrincipal;
    private BigDecimal outstandingInterest;
    // Total amount actually paid (principal + interest combined) — used for progress bar and audit
    private BigDecimal totalPaid;
    private LocalDate disbursementDate;
    private LocalDate firstPaymentDate;
    private LocalDate lastPaymentDate;
    private LocalDate maturityDate;
    private String status;
    private String approvedBy;
    private LocalDate approvalDate;
    private String disbursedBy;
    // Who reviewed the application before approval (from linked application)
    private String reviewedBy;
    private Integer configVersion;
    private String currency;
    // Loan purpose from the linked application — for audit trail
    private String loanPurpose;
    private String purposeDescription;
}
