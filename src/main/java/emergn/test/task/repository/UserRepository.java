package emergn.test.task.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import emergn.test.task.model.User;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    User findByLogin(final String login);
}
