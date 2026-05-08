package et.edu.woldia.coop.mapper;

import et.edu.woldia.coop.dto.ConfigurationDto;
import et.edu.woldia.coop.entity.SystemConfiguration;
import java.time.LocalDateTime;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2026-04-30T16:20:34+0300",
    comments = "version: 1.5.5.Final, compiler: javac, environment: Java 21.0.1 (Oracle Corporation)"
)
@Component
public class ConfigurationMapperImpl implements ConfigurationMapper {

    @Override
    public ConfigurationDto toDto(SystemConfiguration entity) {
        if ( entity == null ) {
            return null;
        }

        ConfigurationDto configurationDto = new ConfigurationDto();

        configurationDto.setRegistrationFee( moneyToDecimal( entity.getRegistrationFee() ) );
        configurationDto.setSharePricePerShare( moneyToDecimal( entity.getSharePricePerShare() ) );
        configurationDto.setMinimumMonthlyDeduction( moneyToDecimal( entity.getMinimumMonthlyDeduction() ) );
        configurationDto.setMaximumLoanCapPerMember( moneyToDecimal( entity.getMaximumLoanCapPerMember() ) );
        configurationDto.setMemberWithdrawalProcessingFee( moneyToDecimal( entity.getMemberWithdrawalProcessingFee() ) );
        configurationDto.setShareTransferFee( moneyToDecimal( entity.getShareTransferFee() ) );
        configurationDto.setMinimumLoanAmount( moneyToDecimal( entity.getMinimumLoanAmount() ) );
        configurationDto.setEffectiveDate( localDateTimeToString( entity.getEffectiveDate() ) );
        if ( entity.getCreatedAt() != null ) {
            configurationDto.setCreatedAt( LocalDateTime.parse( localDateTimeToString( entity.getCreatedAt() ) ) );
        }
        configurationDto.setId( entity.getId() );
        configurationDto.setVersion( entity.getVersion() );
        configurationDto.setMinimumSharesRequired( entity.getMinimumSharesRequired() );
        configurationDto.setMaximumSharesAllowed( entity.getMaximumSharesAllowed() );
        configurationDto.setSavingsInterestRate( entity.getSavingsInterestRate() );
        configurationDto.setLoanInterestRateMin( entity.getLoanInterestRateMin() );
        configurationDto.setLoanInterestRateMax( entity.getLoanInterestRateMax() );
        configurationDto.setLendingLimitPercentage( entity.getLendingLimitPercentage() );
        configurationDto.setFixedAssetLtvRatio( entity.getFixedAssetLtvRatio() );
        configurationDto.setMembershipDurationThresholdMonths( entity.getMembershipDurationThresholdMonths() );
        configurationDto.setLoanMultiplierBelowThreshold( entity.getLoanMultiplierBelowThreshold() );
        configurationDto.setLoanMultiplierAboveThreshold( entity.getLoanMultiplierAboveThreshold() );
        configurationDto.setContractSigningDeadlineDays( entity.getContractSigningDeadlineDays() );
        configurationDto.setLoanDisbursementDeadlineDays( entity.getLoanDisbursementDeadlineDays() );
        configurationDto.setLoanProcessingSlaDays( entity.getLoanProcessingSlaDays() );
        configurationDto.setDelinquencyGracePeriodDays( entity.getDelinquencyGracePeriodDays() );
        configurationDto.setMemberWithdrawalProcessingDays( entity.getMemberWithdrawalProcessingDays() );
        configurationDto.setCollateralAppraisalValidityMonths( entity.getCollateralAppraisalValidityMonths() );
        configurationDto.setVehicleAgeLimitYears( entity.getVehicleAgeLimitYears() );
        configurationDto.setDeductionDecreaseWaitingMonths( entity.getDeductionDecreaseWaitingMonths() );
        configurationDto.setNonRegularSavingsWithdrawalDays( entity.getNonRegularSavingsWithdrawalDays() );
        configurationDto.setLatePaymentPenaltyRate( entity.getLatePaymentPenaltyRate() );
        configurationDto.setLatePaymentPenaltyGraceDays( entity.getLatePaymentPenaltyGraceDays() );
        configurationDto.setEarlyLoanRepaymentPenalty( entity.getEarlyLoanRepaymentPenalty() );
        configurationDto.setMaximumActiveLoansPerMember( entity.getMaximumActiveLoansPerMember() );
        configurationDto.setMaxConsecutiveMissedDeductionsBeforeSuspension( entity.getMaxConsecutiveMissedDeductionsBeforeSuspension() );
        configurationDto.setMinimumMembershipDurationBeforeWithdrawalMonths( entity.getMinimumMembershipDurationBeforeWithdrawalMonths() );
        configurationDto.setCreatedBy( entity.getCreatedBy() );

        return configurationDto;
    }

    @Override
    public SystemConfiguration toEntity(ConfigurationDto dto) {
        if ( dto == null ) {
            return null;
        }

        SystemConfiguration systemConfiguration = new SystemConfiguration();

        systemConfiguration.setRegistrationFee( decimalToMoney( dto.getRegistrationFee() ) );
        systemConfiguration.setSharePricePerShare( decimalToMoney( dto.getSharePricePerShare() ) );
        systemConfiguration.setMinimumMonthlyDeduction( decimalToMoney( dto.getMinimumMonthlyDeduction() ) );
        systemConfiguration.setMaximumLoanCapPerMember( decimalToMoney( dto.getMaximumLoanCapPerMember() ) );
        systemConfiguration.setMemberWithdrawalProcessingFee( decimalToMoney( dto.getMemberWithdrawalProcessingFee() ) );
        systemConfiguration.setShareTransferFee( decimalToMoney( dto.getShareTransferFee() ) );
        systemConfiguration.setMinimumLoanAmount( decimalToMoney( dto.getMinimumLoanAmount() ) );
        systemConfiguration.setMinimumSharesRequired( dto.getMinimumSharesRequired() );
        systemConfiguration.setMaximumSharesAllowed( dto.getMaximumSharesAllowed() );
        systemConfiguration.setSavingsInterestRate( dto.getSavingsInterestRate() );
        systemConfiguration.setLoanInterestRateMin( dto.getLoanInterestRateMin() );
        systemConfiguration.setLoanInterestRateMax( dto.getLoanInterestRateMax() );
        systemConfiguration.setLendingLimitPercentage( dto.getLendingLimitPercentage() );
        systemConfiguration.setFixedAssetLtvRatio( dto.getFixedAssetLtvRatio() );
        systemConfiguration.setMembershipDurationThresholdMonths( dto.getMembershipDurationThresholdMonths() );
        systemConfiguration.setLoanMultiplierBelowThreshold( dto.getLoanMultiplierBelowThreshold() );
        systemConfiguration.setLoanMultiplierAboveThreshold( dto.getLoanMultiplierAboveThreshold() );
        systemConfiguration.setContractSigningDeadlineDays( dto.getContractSigningDeadlineDays() );
        systemConfiguration.setLoanDisbursementDeadlineDays( dto.getLoanDisbursementDeadlineDays() );
        systemConfiguration.setLoanProcessingSlaDays( dto.getLoanProcessingSlaDays() );
        systemConfiguration.setDelinquencyGracePeriodDays( dto.getDelinquencyGracePeriodDays() );
        systemConfiguration.setMemberWithdrawalProcessingDays( dto.getMemberWithdrawalProcessingDays() );
        systemConfiguration.setCollateralAppraisalValidityMonths( dto.getCollateralAppraisalValidityMonths() );
        systemConfiguration.setVehicleAgeLimitYears( dto.getVehicleAgeLimitYears() );
        systemConfiguration.setDeductionDecreaseWaitingMonths( dto.getDeductionDecreaseWaitingMonths() );
        systemConfiguration.setNonRegularSavingsWithdrawalDays( dto.getNonRegularSavingsWithdrawalDays() );
        systemConfiguration.setLatePaymentPenaltyRate( dto.getLatePaymentPenaltyRate() );
        systemConfiguration.setLatePaymentPenaltyGraceDays( dto.getLatePaymentPenaltyGraceDays() );
        systemConfiguration.setEarlyLoanRepaymentPenalty( dto.getEarlyLoanRepaymentPenalty() );
        systemConfiguration.setMaximumActiveLoansPerMember( dto.getMaximumActiveLoansPerMember() );
        systemConfiguration.setMaxConsecutiveMissedDeductionsBeforeSuspension( dto.getMaxConsecutiveMissedDeductionsBeforeSuspension() );
        systemConfiguration.setMinimumMembershipDurationBeforeWithdrawalMonths( dto.getMinimumMembershipDurationBeforeWithdrawalMonths() );

        applyEffectiveDate( dto, systemConfiguration );

        return systemConfiguration;
    }
}
