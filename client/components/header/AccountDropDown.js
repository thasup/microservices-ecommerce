'use client';

import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faListCheck,
  faRightFromBracket,
  faUser
} from '@fortawesome/free-solid-svg-icons';

const AccountDropDown = ({
  currentUser,
  showAccountDropDown,
  setShowAccountDropDown
}) => {
  return (
    <div
      className="account-dropdown-menu"
      style={{ display: showAccountDropDown ? 'block' : 'none' }}
      onMouseLeave={() => setShowAccountDropDown(false)}
    >
      <div className="account-dropdown-item account-dropdown-title d-flex justify-content-center">
        {currentUser?.name}
      </div>

      <Link href="/dashboard" className="account-dropdown-item">
        <FontAwesomeIcon icon={faUser} /> Account
      </Link>

      {currentUser?.isAdmin && (
        <Link href="/admin" className="account-dropdown-item">
          <FontAwesomeIcon icon={faListCheck} /> Management
        </Link>
      )}

      <Link href="/signout" className="account-dropdown-item">
        <FontAwesomeIcon icon={faRightFromBracket} /> Sign Out
      </Link>
    </div>
  );
};

export default AccountDropDown;
