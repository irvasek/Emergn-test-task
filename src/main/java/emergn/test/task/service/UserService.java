package emergn.test.task.service;

import java.util.Collections;
import java.util.HashSet;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import emergn.test.task.model.Role;
import emergn.test.task.model.User;
import emergn.test.task.repository.RoleRepository;
import emergn.test.task.repository.UserRepository;

@Service
public class UserService {
    private static final Logger log = LoggerFactory.getLogger(UserService.class);
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private RoleRepository roleRepository;
    @Autowired
    private PasswordEncoder passwordEncoder;

    public User findByLogin(final String login) {
        return userRepository.findByLogin(login);
    }

    public List<User> findAll() {
        return userRepository.findAll();
    }

    public User create(final User user) {
        final Role role = roleRepository.findByName("USER");
        user.setRoles(new HashSet<>(Collections.singletonList(role)));
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        user.setActive(1);
        final User savedUser = userRepository.save(user);
        log.info("User {} has been created", user.getLogin());
        return savedUser;
    }

    public User update(final User user, final boolean isNewPassword) {
        final User oldUser = findByLogin(user.getLogin());
        if (oldUser != null) {
            if (isNewPassword) {
                oldUser.setPassword(passwordEncoder.encode(user.getPassword()));
                oldUser.setPasswordConfirm(user.getPasswordConfirm());
            }
            oldUser.setUsername(user.getUsername());
            oldUser.setEmail(user.getEmail());
            userRepository.save(oldUser);
            log.info("User {} has been update", oldUser.getLogin());
        } else {
            log.error("User does not exist");
        }
        return oldUser;
    }

    public User delete(final User user) {
        final User currentUser = findByLogin(user.getLogin());
        if (currentUser != null) {
            userRepository.delete(currentUser);
            log.info("User {} has been updated", currentUser.getLogin());
        } else {
            log.error("User does not exist");
        }
        return currentUser;
    }
}
