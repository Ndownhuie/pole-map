import React from "react";
import Links from './Links'
import './Shop.scss'
import { AiOutlineClose } from 'react-icons/ai'
import { Link } from "react-router-dom";
import { makeDistanceLabelText } from "./distance-label";

type Props = {
  shop: Pwamap.ShopData;
  close: Function;
}

const Content = (props: Props) => {
  const mapNode = React.useRef<HTMLDivElement>(null);
  const [map, setMap] = React.useState<any>(null)
  const { shop } = props

  const clickHandler = () => {
    props.close()
    if (mapNode.current) {
      mapNode.current.remove()
    }
    if (map) {
      map.remove()
    }
  }

  React.useEffect(() => {
    if (!mapNode.current) {
      return
    }

    // @ts-ignore
    const nextMap = new window.geolonia.Map({
      container: mapNode.current,
      interactive: false,
      zoom: 14,
      style: `geolonia/gsi`,
    });
    setMap(nextMap)
  }, [shop])

  const distanceTipText = makeDistanceLabelText(shop.distance)
  const category = shop['カテゴリ']
  const content = shop['紹介文'] || ''

const renderTextWithLinks = (text: string) => {
  const lines = text.split(/\r\n|\n|\r/g)
  const urlRegex = /(https?:\/\/[^\s]+)/g

  return lines.map((line, lineIndex) => (
    <React.Fragment key={lineIndex}>
      {line.split(urlRegex).map((part, partIndex) => {
        if (part.match(urlRegex)) {
          const label = part.includes('google.com/maps') || part.includes('maps.google.com')
            ? 'Googleマップを開く'
            : 'リンクを開く'

          return (
            <a
              key={`${lineIndex}-${partIndex}`}
              href={part}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: '#1a73e8', textDecoration: 'underline' }}
            >
              {label}
            </a>
          )
        }

        return (
          <React.Fragment key={`${lineIndex}-${partIndex}`}>
            {part}
          </React.Fragment>
        )
      })}
      {lineIndex < lines.length - 1 && <br />}
    </React.Fragment>
  ))
}

  return (
    <div className="shop-single">
      <div className="head">
        <button onClick={clickHandler}><AiOutlineClose size="16px" color="#FFFFFF" /> 閉じる</button>
      </div>
      <div className="container">
        {shop ?
          <>
            <h2>{shop['スポット名']}</h2>
            <div>
              <span className="nowrap">
                <Link to={`/list?category=${category}`}>
                  <span onClick={clickHandler} className="category">{category}</span>
                </Link>
              </span>
              <span className="nowrap">{distanceTipText && <span className="distance">現在位置から {distanceTipText}</span>}</span>
            </div>

            <div style={{ margin: "24px 0" }}><Links data={shop} /></div>

            {shop['画像'] && <img src={shop['画像']} alt={shop['スポット名']} style={{ width: "100%" }} />}

            <p style={{ margin: "24px 0", wordBreak: "break-all" }}>
              {renderTextWithLinks(content)}
            </p>

            <div
              ref={mapNode}
              style={{ width: '100%', height: '200px', marginTop: "24px" }}
              data-lat={shop['緯度']}
              data-lng={shop['経度']}
              data-navigation-control="off"
            ></div>

            <p>
              <a
                className="small"
                href={`http://maps.apple.com/?q=${shop['緯度']},${shop['経度']}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                スポットまでの道順
              </a>
            </p>
          </>
          :
          <></>
        }
      </div>
    </div>
  );
};

export default Content;
