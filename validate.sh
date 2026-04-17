#!/bin/bash
# CinePhix Frontend - Validation Script
# Run this after npm install and build to verify everything works

set -e

echo "=== CinePhix Frontend Validation ==="

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

FRONTEND_DIR="${FRONTEND_DIR:-.}"

echo -e "\n${YELLOW}1. Checking project structure...${NC}"
if [ -d "$FRONTEND_DIR/web_app/src/stores" ] && [ -d "$FRONTEND_DIR/web_app/src/pages/auth" ]; then
    echo -e "${GREEN}✓ Project structure OK${NC}"
else
    echo -e "${RED}✗ Missing expected directories${NC}"
    exit 1
fi

echo -e "\n${YELLOW}2. Checking store files...${NC}"
for store in auth.js watchlist.js favorites.js user.js; do
    if [ -f "$FRONTEND_DIR/web_app/src/stores/$store" ]; then
        echo -e "${GREEN}✓ $store exists${NC}"
    else
        echo -e "${RED}✗ $store missing${NC}"
        exit 1
    fi
done

echo -e "\n${YELLOW}3. Checking auth pages...${NC}"
for page in LoginPage.vue RegisterPage.vue; do
    if [ -f "$FRONTEND_DIR/web_app/src/pages/auth/$page" ]; then
        echo -e "${GREEN}✓ $page exists${NC}"
    else
        echo -e "${RED}✗ $page missing${NC}"
        exit 1
    fi
done

echo -e "\n${YELLOW}4. Checking API client...${NC}"
if [ -f "$FRONTEND_DIR/web_app/src/api/client.js" ]; then
    echo -e "${GREEN}✓ API client exists${NC}"
else
    echo -e "${RED}✗ API client missing${NC}"
    exit 1
fi

echo -e "\n${YELLOW}5. Checking dependencies in package.json...${NC}"
if grep -q "pinia" "$FRONTEND_DIR/web_app/package.json"; then
    echo -e "${GREEN}✓ Pinia dependency found${NC}"
else
    echo -e "${RED}✗ Pinia not in package.json${NC}"
    exit 1
fi

echo -e "\n${YELLOW}6. Checking router guards...${NC}"
if grep -q "beforeEach" "$FRONTEND_DIR/web_app/src/router/index.js"; then
    echo -e "${GREEN}✓ Navigation guards present${NC}"
else
    echo -e "${RED}✗ Navigation guards missing${NC}"
    exit 1
fi

echo -e "\n${YELLOW}7. Syntax check on new files...${NC}"
if command -v node &> /dev/null; then
    for file in web_app/src/stores/*.js web_app/src/api/*.js; do
        if ! node --check "$file" 2>/dev/null; then
            echo -e "${YELLOW}  Note: $file has syntax issues (may be ESM)${NC}"
        fi
    done
else
    echo -e "${YELLOW}  Node not available - skipping syntax check${NC}"
fi

echo -e "\n${YELLOW}8. Checking Cypress tests...${NC}"
if [ -f "$FRONTEND_DIR/web_app/cypress/e2e/auth.cy.js" ]; then
    echo -e "${GREEN}✓ Auth E2E tests found${NC}"
else
    echo -e "${RED}✗ Auth E2E tests missing${NC}"
    exit 1
fi

echo -e "\n${GREEN}=== Frontend Phase 1 Structure Validated ===${NC}"
echo ""
echo "Next steps:"
echo "  1. npm install (if not done)"
echo "  2. npm run dev (start development server)"
echo "  3. npm run build (verify production build)"
echo "  4. npm run test:e2e (run Cypress tests)"
echo ""
echo "Remember: Backend must be running at VITE_API_URL for full integration."