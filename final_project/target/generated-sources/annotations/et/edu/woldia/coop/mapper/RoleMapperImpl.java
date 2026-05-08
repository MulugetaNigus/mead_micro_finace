package et.edu.woldia.coop.mapper;

import et.edu.woldia.coop.dto.RoleDto;
import et.edu.woldia.coop.entity.Role;
import java.util.LinkedHashSet;
import java.util.Set;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2026-04-30T16:20:34+0300",
    comments = "version: 1.5.5.Final, compiler: javac, environment: Java 21.0.1 (Oracle Corporation)"
)
@Component
public class RoleMapperImpl implements RoleMapper {

    @Override
    public RoleDto toDto(Role entity) {
        if ( entity == null ) {
            return null;
        }

        RoleDto roleDto = new RoleDto();

        if ( entity.getId() != null ) {
            roleDto.setId( entity.getId().toString() );
        }
        roleDto.setName( entity.getName() );
        roleDto.setDescription( entity.getDescription() );
        Set<String> set = entity.getPermissions();
        if ( set != null ) {
            roleDto.setPermissions( new LinkedHashSet<String>( set ) );
        }
        roleDto.setCreatedAt( entity.getCreatedAt() );
        roleDto.setUpdatedAt( entity.getUpdatedAt() );

        return roleDto;
    }

    @Override
    public Role toEntity(RoleDto dto) {
        if ( dto == null ) {
            return null;
        }

        Role role = new Role();

        role.setName( dto.getName() );
        role.setDescription( dto.getDescription() );
        Set<String> set = dto.getPermissions();
        if ( set != null ) {
            role.setPermissions( new LinkedHashSet<String>( set ) );
        }

        return role;
    }
}
