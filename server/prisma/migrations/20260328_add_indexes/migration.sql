-- CreateIndex
CREATE INDEX "ingredients_restaurantId_name_idx" ON "ingredients"("restaurantId", "name");

-- CreateIndex
CREATE INDEX "inventory_items_restaurantId_idx" ON "inventory_items"("restaurantId");

-- CreateIndex
CREATE INDEX "invoices_restaurantId_createdAt_idx" ON "invoices"("restaurantId", "createdAt");

-- CreateIndex
CREATE INDEX "price_history_ingredientId_createdAt_idx" ON "price_history"("ingredientId", "createdAt");

-- CreateIndex
CREATE INDEX "recipes_restaurantId_category_idx" ON "recipes"("restaurantId", "category");

-- CreateIndex
CREATE INDEX "restaurant_members_userId_idx" ON "restaurant_members"("userId");

-- CreateIndex
CREATE INDEX "restaurant_members_restaurantId_idx" ON "restaurant_members"("restaurantId");

-- CreateIndex
CREATE INDEX "suppliers_restaurantId_idx" ON "suppliers"("restaurantId");
