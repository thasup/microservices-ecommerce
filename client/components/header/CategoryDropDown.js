import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";

const CategoryDropDown = ({
	eventTarget,
	showCategoryDropDown,
	setShowCategoryDropDown,
	products,
}) => {
	const [categoryName, setCategoryName] = useState("");
	const [categoryParams, setCategoryParams] = useState("");
	const [categoryProducts, setCategoryProducts] = useState([]);

	const [toggle, setToggle] = useState(false);
	const [isReady, setIsReady] = useState(false);

	useEffect(async () => {
		if (eventTarget) {
			setCategoryName(eventTarget.text);
			setCategoryParams(eventTarget.pathname);

			const categoryArray = await products.filter(
				(product) => product.category === `${categoryName}`
			);
			if (categoryArray.length !== 0) {
				setCategoryProducts(categoryArray.slice(0, 3));
			}

			setShowCategoryDropDown(true);
			setIsReady(true);
		}
	}, [eventTarget]);

	const myLoader = ({ src, quality }) => {
		return `https://www.dropbox.com/s/${src}?raw=1&q=${quality || 50}`;
	};

	return isReady ? (
		<div
			className="category-dropdown-menu"
			style={{
				opacity: showCategoryDropDown ? 1 : 0,
				visibility: showCategoryDropDown ? "visible" : "hidden",
				display: showCategoryDropDown ? "grid" : "none",
			}}
			onMouseLeave={() => setShowCategoryDropDown(false)}
		>
			<div
				className="dropdown-menu-img-wrapper"
				onMouseEnter={() => setToggle(true)}
				onMouseLeave={() => setToggle(false)}
				onTouchStart={toggle ? () => setToggle(false) : () => setToggle(true)}
			>
				{categoryProducts.map((product, index) => (
					<div key={index}>
						<div
							className="dropdown-menu-img__cover"
							style={{ opacity: toggle ? "0" : "1" }}
						>
							<Image
								loader={myLoader}
								src={product.images.image1}
								layout="fill"
								objectFit="cover"
								alt={`${product.title} image 1`}
							/>
						</div>
						<div
							className="dropdown-menu-img__hover"
							style={{ opacity: toggle ? "1" : "0", left: `${index * 33}%` }}
						>
							<Image
								loader={myLoader}
								src={product.images.image2}
								layout="fill"
								objectFit="cover"
								alt={`${product.title} image 2`}
							/>
						</div>
					</div>
				))}
			</div>
			<div className="category-dropdown-wrapper">
				<ul className="menu-parent">
					<li>
						<Link href={`${categoryParams}/bestseller`} passHref>
							<a className="account-dropdown-item">Bestseller</a>
						</Link>
					</li>
					<li>
						<Link href={`${categoryParams}/new`} passHref>
							<a className="account-dropdown-item">New Arrivals</a>
						</Link>
					</li>
					<li>
						<Link href={`${categoryParams}/top-brands`} passHref>
							<a className="account-dropdown-item">Top Brands</a>
						</Link>
					</li>
					<li>
						<Link href={`${categoryParams}/recommend`} passHref>
							<a className="account-dropdown-item">Recommended</a>
						</Link>
					</li>
					<li>
						<Link href={`${categoryParams}/trending`} passHref>
							<a className="account-dropdown-item">Trending</a>
						</Link>
					</li>
					<li>
						<Link href={`${categoryParams}/coming`} passHref>
							<a className="account-dropdown-item">Coming Soon</a>
						</Link>
					</li>
					<li>
						<Link href={`${categoryParams}/sale`} passHref>
							<a className="account-dropdown-item">Sale</a>
						</Link>
					</li>
				</ul>
			</div>
		</div>
	) : null;
};

export default CategoryDropDown;
