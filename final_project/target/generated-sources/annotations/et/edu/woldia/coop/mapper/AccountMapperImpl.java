package et.edu.woldia.coop.mapper;

import et.edu.woldia.coop.dto.AccountDto;
import et.edu.woldia.coop.entity.Account;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2026-04-30T16:20:34+0300",
    comments = "version: 1.5.5.Final, compiler: javac, environment: Java 21.0.1 (Oracle Corporation)"
)
@Component
public class AccountMapperImpl implements AccountMapper {

    @Override
    public AccountDto toDto(Account account) {
        if ( account == null ) {
            return null;
        }

        AccountDto accountDto = new AccountDto();

        accountDto.setAccountType( accountTypeToString( account.getAccountType() ) );
        accountDto.setStatus( statusToString( account.getStatus() ) );
        accountDto.setBalance( moneyToDecimal( account.getBalance() ) );
        accountDto.setPledgedAmount( moneyToDecimal( account.getPledgedAmount() ) );
        accountDto.setAvailableBalance( moneyToDecimal( account.getAvailableBalance() ) );
        accountDto.setId( account.getId() );
        accountDto.setMemberId( account.getMemberId() );
        accountDto.setInterestRate( account.getInterestRate() );
        accountDto.setCreatedDate( account.getCreatedDate() );
        accountDto.setLastInterestDate( account.getLastInterestDate() );
        accountDto.setCreatedAt( account.getCreatedAt() );
        accountDto.setUpdatedAt( account.getUpdatedAt() );

        return accountDto;
    }
}
