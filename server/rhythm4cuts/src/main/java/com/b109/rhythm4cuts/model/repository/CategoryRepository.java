package com.b109.rhythm4cuts.model.repository;

import com.b109.rhythm4cuts.model.domain.Category;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CategoryRepository extends JpaRepository<Category, Integer> {
    Category findByCode(int code);
}
