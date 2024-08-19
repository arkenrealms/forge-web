import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, Flex, Heading, CardBody, ButtonMenu, ButtonMenuItem } from '~/ui';
import Page from '~/components/layout/Page';
import itemAttributes from '@arken/node/data/generated/itemAttributes.json';

const ItemAttributes = () => {
  const { t } = useTranslation();
  const [gameTabIndex, setGameTabIndex] = useState(0);

  return (
    <Page>
      <Card style={{ width: '100%' }}>
        <img
          src="/images/61ac854395b5d05b05b58a37_pin2.png"
          loading="lazy"
          width="314"
          alt=""
          className="image-15"
          style={{ opacity: 0.1 }}
        />
        <Heading as="h2" size="xl" style={{ textAlign: 'center', marginTop: 15 }}>
          {t('Item Attributes')}
        </Heading>
        <CardBody>
          <p>
            This list contains attributes that are complete, a work in progress, or just ideas. It will change a lot as
            development continues.
          </p>
          <div className="attr-table">
            <Flex flexDirection="row" alignItems="center" justifyContent="center">
              <div style={{ marginBottom: 20, marginTop: 20 }}>
                <ButtonMenu activeIndex={gameTabIndex} scale="md" onItemClick={(index) => setGameTabIndex(index)}>
                  <ButtonMenuItem>Raid</ButtonMenuItem>
                  <ButtonMenuItem>Evolution</ButtonMenuItem>
                  <ButtonMenuItem>Infinite</ButtonMenuItem>
                  <ButtonMenuItem>Sanctuary</ButtonMenuItem>
                </ButtonMenu>
              </div>
            </Flex>
            <div className="table-wrapper">
              <div className="w-embed">
                <style
                  dangerouslySetInnerHTML={{
                    __html:
                      '\n        .collection-table-rows:nth-child(odd) {\n          background-color: rgba(255, 85, 85, 0.09);\n        }\n      ',
                  }}
                />
              </div>
              <div className="w-layout-grid table-2 header light">
                <div>ID</div>
                <div>Name</div>
                <div>Effect</div>
                <div>Param1</div>
                <div>Param2</div>
                <div>Param3</div>
              </div>
              <div className="w-dyn-list">
                <div role="list" className="w-dyn-items">
                  {itemAttributes
                    .filter((i) => i.game === gameTabIndex + 1 && !!i.description)
                    .map((itemAttribute, index) => (
                      <div role="listitem" className="collection-table-rows w-dyn-item">
                        <div className={'w-layout-grid table-2 ' + (index % 2 === 0 ? 'row-color alt' : '')}>
                          <div>{itemAttribute.id}</div>
                          <div>{itemAttribute.displayName}</div>
                          <div>{itemAttribute.description}</div>
                          <div>{itemAttribute.param1 ? itemAttribute.param1.spec : ''}</div>
                          <div>{(itemAttribute as any).param2 ? (itemAttribute as any).param2.spec : ''}&nbsp;</div>
                          <div>{(itemAttribute as any).param3 ? (itemAttribute as any).param3.spec : ''}&nbsp;</div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
              {/* <div className="w-layout-grid table-2 row-color alt">
              <div>Attribute Name Goes Here</div>
              <div>Attribute Effect Formula Goes Here</div>
            </div>
            <div className="w-layout-grid table-2">
              <div>Attribute Name Goes Here</div>
              <div>Attribute Effect Formula Goes Here</div>
            </div> */}
            </div>
          </div>
        </CardBody>
      </Card>
    </Page>
  );
};

export default ItemAttributes;
