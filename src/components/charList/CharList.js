import "./charList.scss";

import { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types"; // проверка props на тип данных
import useMarvelService from "../../services/MarvelService";

import Spinner from "../spinner/Spinner";
import ErrorMessage from "../errorMessage/ErrorMessage";

const CharList = (props) => {
  const [charList, setCharList] = useState([]);
  const [newItemLoading, setNewItemLoading] = useState(false);
  const [offset, setOffset] = useState(210);
  const [charEnded, setCharEnded] = useState(false);

  const { loading, error, getAllCharacters } = useMarvelService();

  useEffect(() => {
    if (localStorage.getItem("charListLS")) {
      const charList = JSON.parse(localStorage.getItem("charListLS"));
      setCharList(charList);
      setOffset(offset + charList.length);
    } else {
      onRequest(offset, true);
    }
    // * Подгрузка при скроле в конец страницы
    // onScroll();
  }, []);

  // componentWillUnmout() {
  //   // * Подгрузка при скроле в конец страницы
  //   window.removeEventListener("scroll", this.onScroll);
  // }

  // const onScroll = () => {
  //   window.addEventListener("scroll", () => {
  //     if (newItemLoading) {
  //       return;
  //     }
  //     if (
  //       document.documentElement.clientHeight + window.pageYOffset >=
  //       document.body.clientHeight
  //     ) {
  //       onRequest(offset);
  //     }
  //   });
  // };

  const onRequest = (offset, initial) => {
    initial ? setNewItemLoading(false) : setNewItemLoading(true);

    getAllCharacters(offset).then(onCharListLoaded);
  };

  const onCharListLoaded = (newCharList) => {
    let ended = false;
    if (newCharList.length < 9) {
      ended = true;
    }

    setCharList((charList) => [...charList, ...newCharList]);

    setNewItemLoading((newItemLoading) => false);
    setOffset((offset) => offset + 9);
    setCharEnded((charEnded) => ended);
  };

  const itemRefs = useRef([]);

  const focusOnItem = (id) => {
    itemRefs.current.forEach((item) =>
      item.classList.remove("char__item_selected")
    );
    itemRefs.current[id].classList.add("char__item_selected");
    itemRefs.current[id].focus();
  };

  function renderItems(arr) {
    const items = arr.map((item, i) => {
      let imgStyle = { objectFit: "cover" };
      if (
        item.thumbnail ===
        "http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg"
      ) {
        imgStyle = { objectFit: "unset" };
      }

      return (
        <li
          ref={(el) => (itemRefs.current[i] = el)}
          tabIndex="0"
          className="char__item"
          key={item.id}
          onClick={() => {
            props.onCharSelected(item.id);
            focusOnItem(i);
          }}
          onKeyPress={(e) => {
            e.preventDefault();
            if (e.key === " " || e.key === "Enter") {
              props.onCharSelected(item.id);
              focusOnItem(i);
            }
          }}
        >
          <img src={item.thumbnail} alt={item.name} style={imgStyle} />
          <div className="char__name">{item.name}</div>
        </li>
      );
    });

    return <ul className="char__grid">{items}</ul>;
  }

  if (charList.length > 0) {
    localStorage.setItem("charListLS", JSON.stringify(charList));
  }

  const items = renderItems(charList);

  const errorMessage = error ? <ErrorMessage /> : null;
  const spinner = loading && !newItemLoading ? <Spinner /> : null;

  return (
    <div className="char__list">
      {errorMessage}
      {spinner}
      {items}
      <button
        className="button button__main button__long"
        disabled={newItemLoading}
        style={{ display: charEnded ? "none" : "block" }}
        onClick={() => onRequest(offset)}
      >
        <div className="inner">load more</div>
      </button>
    </div>
  );
};

CharList.propTypes = {
  onCharSelected: PropTypes.func,
};

export default CharList;
