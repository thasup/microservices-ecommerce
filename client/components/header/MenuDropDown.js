import React from "react";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faListCheck,
	faRightFromBracket,
	faUser,
} from "@fortawesome/free-solid-svg-icons";

const MenuDropDown = ({ currentUser, showDropDown, setShowDropDown }) => {
	return (
		<div
			className="account-dropdown-menu"
			style={{ display: showDropDown ? "block" : "none" }}
			onMouseLeave={() => setShowDropDown(false)}
		>
			<div className="account-dropdown-item account-dropdown-title d-flex justify-content-center">
				{currentUser?.name}
			</div>

			<Link href="/dashboard" passHref>
				<a className="account-dropdown-item">
					<FontAwesomeIcon icon={faUser} /> Account
				</a>
			</Link>

			{currentUser?.isAdmin && (
				<Link href="/admin" passHref>
					<a className="account-dropdown-item">
						<FontAwesomeIcon icon={faListCheck} /> Management
					</a>
				</Link>
			)}

			<Link href="/signout" passHref>
				<a className="account-dropdown-item">
					<FontAwesomeIcon icon={faRightFromBracket} /> Sign Out
				</a>
			</Link>
		</div>
	);
};

export default MenuDropDown;
