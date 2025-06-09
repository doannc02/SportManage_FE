import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  FiHome,
  FiUsers,
  FiBox,
  FiSettings,
  FiBarChart2,
  FiChevronDown,
  FiChevronRight,
  FiList,
  FiGift,
  FiLogOut,
} from "react-icons/fi";
import { MdCategory } from "react-icons/md";
import { FaUserShield } from "react-icons/fa";
import { getAppToken, removeAppToken } from "../../configs/token";
import PropTypes from "prop-types";
import { MENU_ENUMS } from "../../const/enum";

function SidebarMenu({ roleName, collapsed, onMenuClick }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [openSubMenus, setOpenSubMenus] = useState({});

  const token = getAppToken();
  if (!token) {
    navigate("/login");
  }

  const toggleSubMenu = (title, e) => {
    e.preventDefault();
    e.stopPropagation();

    if (collapsed) return;

    setOpenSubMenus((prev) => ({
      ...prev,
      [title]: !prev[title],
    }));
  };

  const isActive = (path) => {
    return (
      location.pathname === path || location.pathname.startsWith(`${path}/`)
    );
  };

  const handleMenuItemClick = () => {
    // Close mobile menu when menu item is clicked
    if (onMenuClick) {
      onMenuClick();
    }
  };

  const handleLinkClick = (e, hasSubmenu = false, item) => {
    if (hasSubmenu && collapsed) {
      e.preventDefault();
      return;
    }
    if (item.title === "Đăng xuất") {
      e.preventDefault();
      navigate("/login");
      removeAppToken();
      return;
    }
    handleMenuItemClick();
  };

  return (
    <nav className="sidebar-menu" role="navigation">
      <ul role="menubar">
        {MENU_ENUMS.find(i => i.role === roleName).value.map((item) => (
          <li
            key={item.title}
            className={isActive(item.path) ? "active" : ""}
            role="none"
          >
            {item.submenu ? (
              <>
                <button
                  className={`menu-item ${isActive(item.path) ? "active" : ""}`}
                  onClick={(e) => toggleSubMenu(item.title, e)}
                  aria-expanded={collapsed ? false : openSubMenus[item.title]}
                  aria-haspopup="true"
                  role="menuitem"
                  title={collapsed ? item.title : ""}
                >
                  <span className="icon" aria-hidden="true">
                    {item.icon}
                  </span>
                  {!collapsed && (
                    <>
                      <span className="title">{item.title}</span>
                      <span className="arrow" aria-hidden="true">
                        {openSubMenus[item.title] ? (
                          <FiChevronDown />
                        ) : (
                          <FiChevronRight />
                        )}
                      </span>
                    </>
                  )}
                </button>
                {!collapsed && openSubMenus[item.title] && (
                  <ul
                    className="submenu"
                    role="menu"
                    aria-label={`${item.title} submenu`}
                  >
                    {item.submenu.map((subItem) => (
                      <li key={subItem.path} role="none">
                        <Link
                          to={subItem.path}
                          className={isActive(subItem.path) ? "active" : ""}
                          onClick={handleMenuItemClick}
                          role="menuitem"
                        >
                          <span className="dot" aria-hidden="true">
                            •
                          </span>
                          <span className="title">{subItem.title}</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </>
            ) : (
              <Link
                to={item.path || "#"}
                className={`menu-item ${isActive(item.path) ? "active" : ""}`}
                onClick={(e) => handleLinkClick(e, false, item)}
                role="menuitem"
                title={collapsed ? item.title : ""}
              >
                <span className="icon" aria-hidden="true">
                  {item.icon}
                </span>
                {!collapsed && <span className="title">{item.title}</span>}
              </Link>
            )}
          </li>
        ))}
      </ul>
    </nav>
  );
}
SidebarMenu.propTypes = {
  collapsed: PropTypes.bool,
  onMenuClick: PropTypes.func,
  roleName: PropTypes.string.isRequired,
};

export default SidebarMenu;
