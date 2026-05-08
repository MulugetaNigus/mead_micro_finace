package et.edu.woldia.coop.mapper;

import et.edu.woldia.coop.dto.MemberDto;
import et.edu.woldia.coop.dto.MemberRegistrationDto;
import et.edu.woldia.coop.entity.Member;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2026-04-30T16:20:34+0300",
    comments = "version: 1.5.5.Final, compiler: javac, environment: Java 21.0.1 (Oracle Corporation)"
)
@Component
public class MemberMapperImpl implements MemberMapper {

    @Override
    public MemberDto toDto(Member member) {
        if ( member == null ) {
            return null;
        }

        MemberDto memberDto = new MemberDto();

        memberDto.setMemberType( member.getMemberType() );
        memberDto.setStatus( statusToString( member.getStatus() ) );
        memberDto.setCommittedDeduction( moneyToDecimal( member.getCommittedDeduction() ) );
        memberDto.setId( member.getId() );
        memberDto.setFirstName( member.getFirstName() );
        memberDto.setLastName( member.getLastName() );
        memberDto.setDateOfBirth( member.getDateOfBirth() );
        memberDto.setNationalId( member.getNationalId() );
        memberDto.setPhoneNumber( member.getPhoneNumber() );
        memberDto.setEmail( member.getEmail() );
        memberDto.setAddress( member.getAddress() );
        memberDto.setEmploymentStatus( member.getEmploymentStatus() );
        memberDto.setLastDeductionChangeDate( member.getLastDeductionChangeDate() );
        memberDto.setExternalCooperativeName( member.getExternalCooperativeName() );
        memberDto.setExternalCooperativeMemberId( member.getExternalCooperativeMemberId() );
        memberDto.setRegistrationDate( member.getRegistrationDate() );
        memberDto.setRegistrationConfigVersion( member.getRegistrationConfigVersion() );
        memberDto.setShareCount( member.getShareCount() );
        memberDto.setCreatedAt( member.getCreatedAt() );
        memberDto.setUpdatedAt( member.getUpdatedAt() );
        memberDto.setCreatedBy( member.getCreatedBy() );
        memberDto.setUpdatedBy( member.getUpdatedBy() );

        return memberDto;
    }

    @Override
    public Member toEntity(MemberRegistrationDto dto) {
        if ( dto == null ) {
            return null;
        }

        Member member = new Member();

        member.setMemberType( dto.getMemberType() );
        member.setCommittedDeduction( decimalToMoney( dto.getCommittedDeduction() ) );
        member.setFirstName( dto.getFirstName() );
        member.setLastName( dto.getLastName() );
        member.setDateOfBirth( dto.getDateOfBirth() );
        member.setNationalId( dto.getNationalId() );
        member.setPhoneNumber( dto.getPhoneNumber() );
        member.setEmail( dto.getEmail() );
        member.setAddress( dto.getAddress() );
        member.setEmploymentStatus( dto.getEmploymentStatus() );
        member.setExternalCooperativeName( dto.getExternalCooperativeName() );
        member.setExternalCooperativeMemberId( dto.getExternalCooperativeMemberId() );

        member.setStatus( Member.MemberStatus.ACTIVE );
        member.setShareCount( 0 );

        return member;
    }
}
