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
import { removeAppToken } from "../../configs/token";

const menuItems = [
  {
    title: "Dashboard",
    icon: <FiHome />,
    path: "/admin",
  },
  {
    title: "Quản lý chung",
    icon: <FiList />,
    path: "/generals",
    submenu: [
      {
        title: "Danh mục sản phẩm",
        path: "/generals/categoryProduct",
        icon: <MdCategory />,
      },
      { title: "Nhà cung cấp", path: "/generals/supplier" },
      { title: "Thương hiệu", path: "/generals/brand" },
    ],
  },
  {
    title: "Quản lý người dùng",
    icon: <FiUsers />,
    path: "/users",
    submenu: [
      { title: "Danh sách người dùng", path: "/users/list" },
      { title: "Thêm người dùng mới", path: "/users/new" },
      {
        title: "Phân quyền",
        path: "/users/permissions",
        icon: <FaUserShield />,
      },
    ],
  },
  {
    title: "Brands",
    icon: <FiBox />,
    path: "/brands/list",
  },
  {
    title: "Suppliers",
    icon: <FiBox />,
    path: "/suppliers/list",
  },
  {
    title: "Categories",
    icon: <FiBox />,
    path: "/categories/list",
  },
  {
    title: "Voucher",
    icon: <FiGift />,
    path: "/vouchers/list",
  },
  {
    title: "Order Management",
    icon: <FiList />,
    path: "/order-admin/list",
  },
  {
    title: "Sản phẩm",
    icon: <FiBox />,
    path: "/products/list",
  },
  {
    title: "Báo cáo",
    icon: <FiBarChart2 />,
    path: "/reports",
    submenu: [
      { title: "Doanh thu", path: "/reports/revenue" },
      { title: "Khách hàng", path: "/reports/customers" },
    ],
  },
  {
    title: "Cài đặt",
    icon: <FiSettings />,
    path: "/settings",
  },
  {
    title: "Đăng xuất",
    icon: <FiLogOut />,
  },
];

function SidebarMenu({ collapsed, onMenuClick }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [openSubMenus, setOpenSubMenus] = useState({});
  console.log(menuItems);

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
        {menuItems.map((item) => (
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

export default SidebarMenu;
