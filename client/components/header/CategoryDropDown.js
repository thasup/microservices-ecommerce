import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";

import TopBannerSrc from "../../public/asset/header-banner/Top-category-banner.png";
import BottomBannerSrc from "../../public/asset/header-banner/Bottom-category-banner.png";
import DressBannerSrc from "../../public/asset/header-banner/Dress-category-banner.png";
import SetBannerSrc from "../../public/asset/header-banner/Set-category-banner.png";
import CoatBannerSrc from "../../public/asset/header-banner/Coat-category-banner.png";

const HeaderBannerSrc = {
	Top: TopBannerSrc,
	Bottom: BottomBannerSrc,
	Dress: DressBannerSrc,
	Set: SetBannerSrc,
	Coat: CoatBannerSrc,
};

const CategoryDropDown = ({
	eventTarget,
	showCategoryDropDown,
	setShowCategoryDropDown,
	products,
	bestseller,
}) => {
	const [categoryName, setCategoryName] = useState("");
	const [categoryParams, setCategoryParams] = useState("");

	const [bestsellerProducts, setBestsellerProducts] = useState([]);
	const [newArrivalsProducts, setNewArrivalsProducts] = useState([]);

	const [isReady, setIsReady] = useState(false);

	const menuItems = [
		"Bestseller",
		"New Arrivals",
		"Top Brands",
		"Recommended",
		"Trending",
		"Coming Soon",
		"Sale",
	];

	useEffect(async () => {
		if (eventTarget) {
			setCategoryName(eventTarget.text);
			setCategoryParams(eventTarget.pathname);

			const bestsellerArray = bestseller
				.filter((product) => product.category === `${categoryName}`)
				.slice(0, 3);
			if (bestsellerArray.length !== 0) {
				setBestsellerProducts(bestsellerArray);
			}

			const newArrivalsArray = products
				.filter((product) => product.category === `${categoryName}`)
				.reverse()
				.slice(0, 2);
			if (newArrivalsArray.length !== 0) {
				setNewArrivalsProducts(newArrivalsArray);
			}

			setShowCategoryDropDown(true);
			setIsReady(true);
		}
	}, [eventTarget, categoryName]);

	return isReady ? (
		<div
			className="category-dropdown-menu"
			style={{
				opacity: showCategoryDropDown ? 1 : 0,
				visibility: showCategoryDropDown ? "visible" : "hidden",
				top: showCategoryDropDown ? "75px" : "-5000px",
			}}
			onMouseEnter={() => setShowCategoryDropDown(true)}
			onMouseLeave={() => setShowCategoryDropDown(false)}
		>
			<div
				className="dropdown-menu-img-wrapper"
				onClick={() => setShowCategoryDropDown(false)}
			>
				<Link href={categoryParams} passHref>
					<a className="overlay"></a>
				</Link>
				<Image
					src={HeaderBannerSrc[`${categoryName}`]}
					layout="fill"
					objectFit="cover"
					objectPosition="center center"
					priority="true"
					alt="category banner"
				/>
			</div>
			<div className="category-dropdown-wrapper">
				<ul className="menu-parent">
					{menuItems.map((item, index) => (
						<li className="menu-parent-item" key={index}>
							<Link
								href={`${categoryParams}/${item
									.replace(" ", "-")
									.toLowerCase()}`}
								passHref
							>
								<a
									className="menu-parent-link"
									onClick={() => setShowCategoryDropDown(false)}
								>
									{item}
								</a>
							</Link>
							{item === "Bestseller" && (
								<ul className="menu-child">
									{bestsellerProducts.map((product, index) => (
										<li key={index}>
											<Link href={`/products/${product.id}`} passHref>
												<a
													className="menu-child-link"
													onClick={() => setShowCategoryDropDown(false)}
												>
													{product.title}
												</a>
											</Link>
										</li>
									))}
								</ul>
							)}
							{item === "New Arrivals" && (
								<ul className="menu-child">
									{newArrivalsProducts.map((product, index) => (
										<li key={index}>
											<Link href={`/products/${product.id}`} passHref>
												<a
													className="menu-child-link"
													onClick={() => setShowCategoryDropDown(false)}
												>
													{product.title}
												</a>
											</Link>
										</li>
									))}
								</ul>
							)}
						</li>
					))}
				</ul>
			</div>
		</div>
	) : null;
};

export default CategoryDropDown;
