package et.edu.woldia.coop.mapper;

import et.edu.woldia.coop.dto.TransactionDto;
import et.edu.woldia.coop.entity.Transaction;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2026-04-30T16:20:34+0300",
    comments = "version: 1.5.5.Final, compiler: javac, environment: Java 21.0.1 (Oracle Corporation)"
)
@Component
public class TransactionMapperImpl implements TransactionMapper {

    @Override
    public TransactionDto toDto(Transaction transaction) {
        if ( transaction == null ) {
            return null;
        }

        TransactionDto transactionDto = new TransactionDto();

        transactionDto.setTransactionType( transactionTypeToString( transaction.getTransactionType() ) );
        transactionDto.setAmount( moneyToDecimal( transaction.getAmount() ) );
        transactionDto.setBalanceBefore( moneyToDecimal( transaction.getBalanceBefore() ) );
        transactionDto.setBalanceAfter( moneyToDecimal( transaction.getBalanceAfter() ) );
        transactionDto.setId( transaction.getId() );
        transactionDto.setAccountId( transaction.getAccountId() );
        transactionDto.setTimestamp( transaction.getTimestamp() );
        transactionDto.setSource( transaction.getSource() );
        transactionDto.setReference( transaction.getReference() );
        transactionDto.setProcessedBy( transaction.getProcessedBy() );
        transactionDto.setNotes( transaction.getNotes() );

        return transactionDto;
    }
}
