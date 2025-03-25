import React, { useRef, useEffect } from 'react';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { SidebarProps } from './types';
import './style.scss';

const Sidebar: React.FC<SidebarProps> = ({
  items,
  activeItemId,
  onItemClick,
  className = '',
  collapsed = false,
  onToggleCollapse,
}) => {
  const contentRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef(new Map<string, HTMLDivElement>());

  // 更新活动菜单项的位置变量，用于光效追踪
  useEffect(() => {
    const updateActivePosition = () => {
      if (!contentRef.current || !activeItemId) return;

      const activeItemElement = itemRefs.current.get(activeItemId);
      if (!activeItemElement) return;

      const contentRect = contentRef.current.getBoundingClientRect();
      const itemRect = activeItemElement.getBoundingClientRect();

      // 计算相对于内容区域的位置
      const relativeTop = itemRect.top - contentRect.top;

      // 使用CSS变量设置激活项位置
      document.documentElement.style.setProperty('--active-menu-position', `${relativeTop}px`);
    };

    updateActivePosition();

    // 窗口大小变化时更新位置
    window.addEventListener('resize', updateActivePosition);

    return () => {
      window.removeEventListener('resize', updateActivePosition);
    };
  }, [activeItemId]);

  const handleItemClick = (itemId: string) => {
    if (onItemClick) {
      onItemClick(itemId);
    }
    const item = items.find(i => i.id === itemId);
    if (item && item.onClick) {
      item.onClick();
    }
  };

  // 定义正确的ref回调函数
  const setItemRef = (id: string) => (el: HTMLDivElement | null) => {
    if (el) {
      itemRefs.current.set(id, el);
    }
  };

  return (
    <div className={`sidebar ${collapsed ? 'sidebar--collapsed' : ''} ${className}`}>
      <div className="sidebar__content" ref={contentRef}>
        {items.map(item => (
          <div
            key={item.id}
            ref={setItemRef(item.id)}
            className={`sidebar__item ${activeItemId === item.id ? 'sidebar__item--active' : ''}`}
            onClick={() => handleItemClick(item.id)}
            data-testid={`sidebar-item-${item.id}`}
          >
            {activeItemId === item.id && <span className="indicator"></span>}
            <span className="sidebar__item-icon">
              {item.icon}
              {item.badge && item.badge > 0 && (
                <span className="sidebar__item-badge">{item.badge}</span>
              )}
            </span>
            <span className="sidebar__item-label">{item.label}</span>
          </div>
        ))}
      </div>
      {onToggleCollapse && (
        <div className="sidebar__footer">
          <button
            onClick={onToggleCollapse}
            data-testid="sidebar-toggle-button"
            aria-label={collapsed ? '展开侧边栏' : '收起侧边栏'}
          >
            <span className="sidebar__toggle-icon--expand">
              <FiChevronLeft size={18} />
            </span>
            <span className="sidebar__toggle-icon--collapse">
              <FiChevronRight size={18} />
            </span>
          </button>
        </div>
      )}
    </div>
  );
};

export default Sidebar;
