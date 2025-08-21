package com.LinkerNet.LinkerNet.repository;

import com.LinkerNet.LinkerNet.model.Message;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ChatRepo extends JpaRepository<Message, Long> {
}

