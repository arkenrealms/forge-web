import React, { useEffect, useRef, useState, useContext } from 'react';
import styled, { css } from 'styled-components';
import { Link as RouterLink, NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button, Tag, Flex, Card, Heading, CardBody, Link, BaseLayout, OpenNewIcon } from '~/ui';
import Page from '~/components/layout/Page';

const dummy = styled.div``;

const Report = ({ report }) => {
  return (
    <div
      css={css`
        border: 1px solid #bb955e;
        padding: 10px;
        margin-bottom: 20px;
        font-size: 0.9rem;
      `}>
      <h3 style={{ fontSize: '1.2rem' }}>{report.what}</h3>
      <br />
      <p>
        <strong>Date: {report.when}</strong>
        <br />
        <strong>Reason: {report.why}</strong>
        <br />
        <strong>Links:</strong> <br />
        <ul>
          {report.links.map((link) => (
            <li>
              <a href={link} target="_blank" rel="noreferrer">
                {link}
              </a>
            </li>
          ))}
        </ul>
      </p>
    </div>
  );
};

const Transparency = () => {
  const { t } = useTranslation();

  const reports = [
    {
      id: 'oldfund',
      what: 'Sold 300 RUNE + 3.5M RXS for 70K on PancakeSwap',
      when: 'Feb 3, 2022',
      why: 'Salaries',
      links: [
        'https://bscscan.com/tx/0x41543e4871aa6e6bc374b13e29ede862339c5d7696df319a85b6cd4fea5771cf',
        'https://bscscan.com/tx/0xcf3e9943827d347434de9f5d2e125c0e6574b533be328eed423c225c8273b966',
        'https://bscscan.com/tx/0xa7bae01657f8120e67fa1a0ba46480842f0b183865cccf94ad9bae0108f6ef22',
      ],
    },
    {
      id: 'fund1',
      what: 'Sold 300 RUNE for 15K on PancakeSwap',
      when: 'May 5, 2022',
      why: 'Salaries',
      links: ['https://bscscan.com/tx/0x94b23b146aba5bdea0711353346adc15cf07fcf4ddc1cddb0eb44d756112ba57'],
    },
    {
      id: 'fund2',
      what: 'Sold 250 RUNE for 10K on PancakeSwap',
      when: 'May 20, 2022',
      why: 'Salaries',
      links: ['https://bscscan.com/tx/0x1e382649d57aeb4c16c4f2fd1ec04bb86a0996867d765302474ea1028f0789c5'],
    },
    {
      id: 'fund3',
      what: 'Sold 200 RUNE for 5K on PancakeSwap',
      when: 'June 14, 2022',
      why: 'Salaries',
      links: ['https://bscscan.com/tx/0x88eb4b971bf4991d92a63cc16bf9092257c9e85effc5eb00d80ac7244c40c7f2'],
    },
    {
      id: 'fund4',
      what: 'Sold 270 RUNE for 6.5K on PancakeSwap',
      when: 'June 27, 2022',
      why: 'Salaries',
      links: ['https://bscscan.com/tx/0xdc6d6c6194bc524694ff1f94bb729a715f14319f767b4ed83358971ac1cfcbae'],
    },
  ];

  const upworkReports = [
    {
      id: 'upwork2022',
      what: 'Upwork 2022',
      when: 'July 1, 2022',
      why: 'Salaries',
      links: ['https://arken.gg/reports/Upwork-2022.csv'],
    },
  ];

  return (
    <Page>
      <Card style={{ width: '100%' }}>
        <Heading as="h2" size="xl" style={{ textAlign: 'center', marginTop: 15 }}>
          {t('Transparency')}
        </Heading>
        <hr />
        <CardBody>
          <p>
            Arken is a community-built project founded in 2021. It relies on fundraisers and token sales to sustain
            operations, as we currently have not raised venture capital (or taken debt). Therefore, we rely on the vault
            and community support. If we are short of <strong>development</strong> funds, we will sell the Rune tokens
            on market as needed. However, we will not do this unless we need the funds for a good reason, such as
            employment obligations. For other funds, such as marketing or listing costs, we will hold fundraisers. If we
            raise, great, if not, we continue on focused development. Selling our tokens is not something we like doing,
            especially when the market isn't flowing, but we will always weigh the costs before we do. Keeping core
            development going is our top priority. It's worth noting that most of our team either take a cut of the
            vault RXS (usually timelocked), while others are FIAT contractors.
          </p>
          <br />
          <p>Below is a transparency report for sales:</p>
          <br />
          <br />
          {reports.reverse().map((r) => (
            <Report key={r.id} report={r} />
          ))}
          <br />
          <br />
          Additionally, you can find our Upwork yearly reports below. Not all staff are employed on Upwork and some are
          simply for jurisdiction convenience. Last names have been removed for privacy.
          <br />
          <br />
          {upworkReports.reverse().map((r) => (
            <Report key={r.id} report={r} />
          ))}
        </CardBody>
      </Card>
    </Page>
  );
};

export default Transparency;
