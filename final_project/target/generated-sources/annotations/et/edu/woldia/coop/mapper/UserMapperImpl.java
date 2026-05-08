package et.edu.woldia.coop.mapper;

import et.edu.woldia.coop.dto.UserDto;
import et.edu.woldia.coop.entity.User;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2026-04-30T16:20:34+0300",
    comments = "version: 1.5.5.Final, compiler: javac, environment: Java 21.0.1 (Oracle Corporation)"
)
@Component
public class UserMapperImpl implements UserMapper {

    @Override
    public UserDto toDto(User entity) {
        if ( entity == null ) {
            return null;
        }

        UserDto userDto = new UserDto();

        userDto.setRoles( rolesToNames( entity.getRoles() ) );
        if ( entity.getId() != null ) {
            userDto.setId( entity.getId().toString() );
        }
        userDto.setUsername( entity.getUsername() );
        userDto.setEmail( entity.getEmail() );
        if ( entity.getStatus() != null ) {
            userDto.setStatus( entity.getStatus().name() );
        }
        userDto.setLastLogin( entity.getLastLogin() );
        userDto.setCreatedAt( entity.getCreatedAt() );
        userDto.setUpdatedAt( entity.getUpdatedAt() );
        userDto.setCreatedBy( entity.getCreatedBy() );
        userDto.setUpdatedBy( entity.getUpdatedBy() );

        return userDto;
    }

    @Override
    public User toEntity(UserDto dto) {
        if ( dto == null ) {
            return null;
        }

        User user = new User();

        user.setUsername( dto.getUsername() );
        user.setEmail( dto.getEmail() );
        if ( dto.getStatus() != null ) {
            user.setStatus( Enum.valueOf( User.UserStatus.class, dto.getStatus() ) );
        }

        return user;
    }
}
