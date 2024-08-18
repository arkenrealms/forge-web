import React, { useEffect, useRef, useState, useContext } from 'react';
import { decodeItem } from 'rune-backend-sdk/build/util/item-decoder';
import styled from 'styled-components';
import { createGlobalStyle } from 'styled-components';
import { Link, Redirect, useParams } from 'react-router-dom';
import { Button, Flex, Card, Heading, CardBody, BaseLayout } from '~/ui';
import Page from '~/components/layout/Page';
import PageWindow from '~/components/PageWindow';

import { ItemInfo } from '~/components/ItemInfo';
import { ItemCategoriesType } from 'rune-backend-sdk/build/data/items.type';

const Container = styled.div`
  h2 {
    line-height: 2rem;
    margin-bottom: 15px;
  }
  p {
    line-height: 1.3rem;
    margin-bottom: 10px;
  }
  li {
    line-height: 1.3rem;
    margin-bottom: 5px;
  }

  font-size: 0.9rem;
`;

const Cards = styled(BaseLayout)`
  align-items: stretch;
  justify-content: stretch;
  margin-bottom: 32px;

  & > div {
    grid-column: span 6;
    width: 100%;
  }

  ${({ theme }) => theme.mediaQueries.sm} {
    & > div {
      grid-column: span 6;
    }
  }

  ${({ theme }) => theme.mediaQueries.lg} {
    & > div {
      grid-column: span 6;
    }
  }
`;

const Risks = () => {
  return (
    <Page>
      <Container>
        <Card>
          <CardBody>
            <Heading size="xl" mb="24px">
              Terms &amp; Conditions
            </Heading>
            <br />
            <br />
            <p>
              These Terms of Use constitute a legally binding agreement made between you, whether personally or on
              behalf of an entity (“you") and Arken Entertainment Inc. (“we", “us", or “our") concerning your access to
              and use of the arken.gg website and the arken.gg app as well as any other media form, media channel,
              mobile website or mobile application related, linked, or otherwise connected thereto (collectively, the
              “Site" and the “App"). arken.gg is a distributed application that is currently running on the Ethereum
              Network, and Binance Smart Chain Network (the "Blockchains"), using specially-developed smart contracts
              (each, a “Smart Contract”) to enable users to own, transfer, battle, and breed genetically unique digital
              creatures. It also enables users to own and transfer other digital assets like plots of land and items.
              These assets can then be visualized on a website that the user can interact with the Site. The Smart
              Contracts and the Site are collectively referred to in these Terms as the “App”. Using the App, users can
              view their assets and use the Smart Contracts to acquire, trade, battle, and breed creatures with other
              App users.
            </p>
            <p>
              WE ARE ONLY WILLING TO MAKE THE APP, THE SMART CONTRACTS, AND THE SITE AVAILABLE TO YOU IF YOU ACCEPT ALL
              OF THESE TERMS. BY USING THE APP, THE SMART CONTRACTS, THE SITE, OR ANY PART OF THEM, OR BY CLICKING “I
              ACCEPT” BELOW OR INDICATING YOUR ACCEPTANCE IN AN ADJOINING BOX, YOU ARE CONFIRMING THAT YOU HAVE READ,
              UNDERSTAND, AND AGREE TO BE BOUND BY ALL OF THESE TERMS OF USE. IF YOU DO NOT AGREE AND/OR ACCEPT ALL OF
              THESE TERMS OF USE, THEN YOU ARE EXPRESSLY PROHIBITED FROM USING THE SITE, THE APP AND THE SMART CONTRACTS
              AND YOU MUST DISCONTINUE USE IMMEDIATELY.
            </p>
            <p>
              Supplemental terms and conditions or documents that may be posted on the Site, the App, and the Smart
              Contracts from time to time are hereby expressly incorporated herein by reference. We reserve the right,
              in our sole discretion, to make changes or modifications to these Terms of Use at any time and for any
              reason. We will alert you of any changes by updating the “Last Updated" date of these Terms of Use, and
              you waive any right to receive specific notice of each such change. It is your responsibility to
              periodically review these Terms of Use to stay informed of updates. You will be subject to and will be
              deemed to have been made aware of and to have accepted, the changes in any revised Terms of Use by your
              continued use of the Site, the App, and the Smart Contracts after the date such revised Terms of Use are
              posted.
            </p>
            <p>
              The information on the Site, the App and the Smart Contracts are not intended for distribution to or used
              by any person or entity in any jurisdiction or country where such distribution or use would be contrary to
              law or regulation or which would subject us to any registration requirement within such jurisdiction or
              country. Accordingly, those persons who choose to access the Site and/or the App from other locations do
              so on their own initiative and are solely responsible for compliance of local laws, if and to the extent
              local laws are applicable.
            </p>
            <p>
              The Site is intended for users who are at least 18 years old. People under the age of 18 are not permitted
              to use or register for the Site, the App, and the Smart Contracts.
            </p>
            <br />
            <br />
            <h2>1. INTELLECTUAL PROPERTY RIGHTS</h2>
            <p>
              Unless otherwise indicated, the Site and the App and the Smart Contracts are our proprietary property and
              all source code, database, functionality, software, website design, audio, video, text, photographs, and
              graphics on the Site and the Apps (collectively, the “Content") and trademarks, service marks and logos
              contained therein (the “Marks") are owned, controlled by us or licensed to us, and are protected by
              copyright and trademark laws and various other intellectual property rights and unfair competition laws of
              the Cayman Islands, foreign jurisdiction and international conventions. Except as expressly provided in
              these Terms of Use, no part of the Site, the App as well as the Smart Contract and no Content or Marks may
              be copied, reproduced, aggregated, republished, uploaded, posted, publicly displayed, encoded, translated,
              transmitted, distributed, sold, licensed, or otherwise exploited for any commercial purpose whatsoever,
              without our express prior written permission.
            </p>
            <p>
              Provided that you are eligible to use the Site, the App and the Smart Contracts, you are granted a limited
              license to access and use the Site or to download or print a copy of any portion of the Content to which
              you have properly gained access solely to your personal, non-commercial use. We reserve all rights not
              expressly granted to you in and to the Site, the App, the Content, and the Marks.
            </p>
            <p>
              Provided that you own an ERC721 Rune asset, you are granted a license to create fan-art and merchandise
              which can be used commercial given that you follow the terms set herein:
            </p>
            <p>
              Anyone creating fanart of Arken: Guardians Unleashed needs to either own the Rune Guardian they are
              creating fan art from or receive permission from that Arken: Guardians Unleashed owner.
            </p>
            <p>Creating original fanart without monetizing it is acceptable without any license or ownership.</p>
            <br />
            <br />
            <h2>2. USER REPRESENTATIONS</h2>
            <p>
              By using the Site, the App and the Smart Contracts, you represent and warrant that: (1) all registration
              information you submit will be true, accurate, current, and complete; (2) you will maintain the accuracy
              of such information and promptly update such registration information as necessary; (3) you have the legal
              capacity and you agree to comply with these Terms of Use; (4) you are not a minor in the jurisdiction in
              which you reside; (5) you will not access the Site, the App and the Smart Contracts through automated and
              non-human means, whether through a bot, script or otherwise. Except as expressly mentioned herein;
            </p>
            <p>
              (6) you will not use the Site, the App, and the Smart Contracts for any illegal and unauthorized purpose;
              and (7) your use of the Site, the App, and the Smart Contracts will not violate any applicable law or
              regulation. If you provide any information that is untrue, inaccurate, not current, or incomplete, we have
              the right to suspend or terminate your account and refuse any and all current or future use of the Site,
              the App, and the Smart Contracts (or any portion thereof).
            </p>
            <p>
              (8) you can only play on on one account in any 24-hour period. (9) you, as an Rune owner, are responsible
              for the actions of any "scholars" (players hired by you) that play on your behalf, and that their actions
              can have consequences for any connected accounts that you own. (10) you will not manipulate the energy
              system, such as gifting Arken: Guardians Unleashed to make use of more energy (This goes under
              multi-accounting). (11) you have not been included in any trade embargoes or economic sanctions list (such
              as united nations security council sanctions list), the list of specially designated nationals maintained
              by ofac (the office of foreign assets control of the u.s. department of the treasury), or the denied
              persons or entity list of the u.s. department of commerce. Arken Entertainment Inc. reserves the right to
              choose markets and jurisdictions to conduct business, and may restrict or refuse, in its discretion, the
              provision of arken.gg services in certain countries or regions.
            </p>
            <br />
            <br />
            <h2>3. USER REGISTRATION</h2>
            <p>
              You may be required to register with the Site, the App, and the Smart Contracts. You agree to keep your
              password confidential and will be responsible for all use of your account and password. We reserve the
              right to remove, reclaim or change a username you select if we determine, in our sole discretion, that
              such username is inappropriate, obscene, or otherwise objectionable.
            </p>
            <br />
            <br />
            <h2>4. PROHIBITED ACTIVITIES</h2>
            <p>
              You may not access or use the Site, the App, and the Smart Contracts for any purpose other than that for
              which we make the Site, the App, and the Smart Contracts available. The Site, the App, and the Smart
              Contracts may not be used in connection with any commercial endeavors except if agreed to in a binding
              legal contract with Arken Entertainment Inc..
            </p>
            <ul>
              <li>
                Make any unauthorized use of the Site, the App and the Smart Contracts, including collecting usernames
                and/or email addresses of users by electronic or other means for the purpose of sending unsolicited
                email, or creating user accounts by automated means or under false pretenses.
              </li>
              <li>
                Use a buying agent or purchasing agent to make purchases on the Site, the App, and the Smart Contracts.
              </li>
              <li>Use the Site, the App and the Smart Contracts to advertise or offer to sell goods and services.</li>
              <li>
                Circumvent, disable, or otherwise interfere with security-related features of the Site, the App and the
                Smart Contracts, including features that prevent or restrict the use or copying of any Content or
                enforce limitations on the use of the Site, the App and the Smart Contracts and/or the Content contained
                therein.
              </li>
              <li>Engage in unauthorized framing of or linking to the Site, the App, and the Smart Contracts.</li>
              <li>
                Trick, defraud, or mislead us and other users, especially in any attempt to learn sensitive account
                information such as user passwords.
              </li>
              <li>Make improper use of our support services or submit false reports of abuse or misconduct.</li>
              <li>
                Engage in any automated use of the system, such as using scripts to send comments or messages, or using
                any data mining, robots, or similar data gathering and extraction tools, except as mentioned in 2.5)
              </li>
              <li>
                Interfere with, disrupt, or create an undue burden on the Site, the App, and the Smart Contracts or the
                networks or services connected to the Site.
              </li>
              <li>Attempt to impersonate another user or person or use the username of another user.</li>
              <li>Intentionally exploit game mechanics for your or your associate's benefit.</li>
              <li>
                Use any information obtained from the Site, the App, and the Smart Contracts in order to harass, abuse,
                or harm another person.
              </li>
              <li>
                Use the Site, the App, and the Smart Contracts as part of any effort to compete with us or otherwise use
                the Site, the App, and the Smart Contracts and/or the Content for any revenue-generating endeavor or
                commercial enterprise.
              </li>
              <li>
                Decipher, decompile, disassemble, or reverse engineer any of the software comprising or in any way
                making up a part of the Site, the App, and the Smart Contracts.
              </li>
              <li>
                Attempt to bypass any measures of the Site designed to prevent or restrict access to the Site, or any
                portion of the Site, the App, and the Smart Contracts.
              </li>
              <li>
                Harass, intimidate, or threaten any of our employees or agents engaged in providing any portion of the
                Site, the App, and the Smart Contracts to you.
              </li>
              <li>Delete the copyright or other proprietary rights notice from any Content.</li>
              <li>
                Copy or adapt the Site’s software, including but not limited to WebGL, Executables, HTML, JavaScript, or
                other code.
              </li>
              <li>
                Upload or transmit (or attempt to upload or to transmit) viruses, Trojan horses, or other material,
                including excessive use of capital letters and spamming (continuous posting of repetitive text), that
                interferes with any party’s uninterrupted use and enjoyment of the Site or modifies, impairs, disrupts,
                alters, or interferes with the use, features, functions, operation, or maintenance of the Site, the App
                and the Smart Contracts.
              </li>
              <li>
                Upload or transmit (or attempt to upload or to transmit) any material that acts as a passive or active
                information collection or transmission mechanism, including without limitation, clear graphics
                interchange formats (“gifs”), 1×1 pixels, web bugs, cookies, or other similar devices (sometimes
                referred to as “spyware” or “passive collection mechanisms” or “pcms”).
              </li>
              <li>
                Except as may be the result of standard search engines or Internet browser usage, use, launch, develop,
                or distribute any automated system, including without limitation, any spider, robot, cheat utility,
                scraper, or offline reader that accesses the Site, the App and the Smart Contracts, or using or
                launching any unauthorized script or other software.
              </li>
              <li>
                Disparage, tarnish, or otherwise harm, in our opinion, us and/or the Site, the App, and the Smart
                Contracts.
              </li>
              <li>
                Use the Site, the App, and the Smart Contracts in a manner inconsistent with any applicable laws or
                regulations.
              </li>
            </ul>
            <br />
            <br />
            <h2>5. FEE AND PAYMENT</h2>
            <p>
              If you elect to purchase, trade, or breed Arken: Guardians Unleashed (“mascots”) and Rune Guardian Eggs
              (collectively, “Arken: Guardians Unleashed"), which will be released by us and we will make them available
              for purchase on the day we first launch Arken: Guardians Unleashed, then we will release additional Arken:
              Guardians Unleashed from time to time an egg is purchased on the Site and/or the App, or with or from
              other users via the App, any financial transactions that you engage in will be conducted solely through
              the Blockchain via a wallet such as MetaMask or Binance Smart Chain Wallet. We will have no insight into
              or control over these payments or transactions, nor do we have the ability to reverse any transactions.
              With that in mind, we will have no liability to you or to any third party for any claims or damages that
              may arise as a result of any transactions that you engage in via the Site and/or the App or using the
              Smart Contracts, or any other transactions that you conduct via the Ethereum or Binance Smart Chain
              ("BSC") network,
            </p>
            <p>
              Ethereum requires the payment of a transaction fee (a “Gas Fee”) for every transaction that occurs on the
              Ethereum network. The Gas Fee funds the network of computers that run the decentralized Ethereum network.
              This means that you will need to pay a Gas Fee for each transaction that occurs via the App.
            </p>
            <br />
            <br />
            <h2>6. SUBMISSION</h2>
            <p>
              You acknowledge and agree that any questions, comments, suggestions, ideas, feedback or other information
              regarding the Site, the App and the Smart Contracts (“Submissions") provided by you to us are
              non-confidential and should become our sole property. We should own exclusive rights, including all
              intellectual property rights, and should be entitled to the unrestricted use and dissemination of these
              Submissions to any lawful purpose, commercial, or otherwise, without acknowledgment or compensation for
              you. You hereby waive any moral rights to any such Submissions, and you hereby warrant that any such
              Submissions are original with you or that you have the right to submit such Submissions. You agree there
              should be no recourse against us for any alleged or actual infringement or misappropriation of any
              proprietary right in your Submissions.
            </p>
            <br />
            <br />
            <h2>7. THIRD-PARTY WEBSITE AND CONTENT</h2>
            <p>
              The Site and/or the App (or you may be sent via the Site and/or the App) links to other websites
              (“Third-Party Websites") as well as articles, photograph, text, graphics, pictures, designs, music, sound,
              video, information, applications, software, and other content or items belonging to or originating from
              third parties (“Third-Party Content"). Such Third-Party Websites and Third-Party Content are not
              investigated, monitored, or checked for accuracy, appropriateness, or completeness by us, and we are not
              responsible for any Third-Party Websites accessed through the Site and/or the App, or any Third-Party
              Content posted on, available through, or installed from the Site and/or the App, including the content,
              accuracy, offensiveness, opinions, reliability, privacy practices, or other policies of or contained in
              the Third-Party Websites or the Third-Party Content. Inclusion of, linking to, or permitting the use or
              installation of any Third-Party Websites or any Third-Party Content does not imply approval or endorsement
              thereof by us. If you decide to leave the Site and/or the App and access the Third-Party Websites or to
              use or install any Third-Party Content, you do so at your own risk and you should be aware of these Terms
              of Use no longer govern. You should review the applicable terms and policies, including privacy and data
              gathering practices, of any website to which you navigate from the Site and/or the App or relating to any
              applications you use or install from the Site and/or the App. Any purchase you make through Third-Party
              Websites will be through other websites and from other companies, and we take no responsibility whatsoever
              in relation to such purchases which are exclusively between you and the applicable third party. You agree
              and acknowledge that we do not endorse the products and services offered on Third-Party Websites and you
              should hold us harmless from any harm caused by your purchase of such products and services. Additionally,
              you should hold us harmless from any losses sustained by you or harm caused to you relating to resulting
              in any way from any Third-Party Content or any contact with Third-Party Websites.
            </p>
            <br />
            <br />
            <h2>8. ADVERTISER</h2>
            <p>
              We allow advertisers to display their advertisements and other information in certain areas of the Site
              and the App such as sidebar advertisements or banner advertisements. If you are an advertiser, you should
              take full responsibility for any advertisements you place on the Site and/or the App, and any services
              provided on the Site and/or the App, or products sold through those advertisements. Further, as an
              advertiser, you warrant and represent that you possess all rights and authority to place advertisements on
              the Site and/or the App, including, but not limited to, intellectual property rights, publicity rights,
              and contractual rights. We simply provide the space to place such advertisements, and we have no other
              relationship with advertisers.
            </p>
            <br />
            <br />
            <h2>9. TERMINATION</h2>
            <p>
              These Terms of Use remain in full force and effect while you use the Site, the App and the Smart
              Contracts. WITHOUT LIMITING ANY OTHER PROVISION OF THESE TERMS OF USE, WE RESERVE THE RIGHT TO, IN OUR
              SOLE DISCRETION AND WITHOUT NOTICE OR LIABILITY, DENY ACCESS TO AND USE OF THE SITE, THE APP AND THE SMART
              CONTRACT (INCLUDING BLOCKING CERTAIN IP ADDRESSES) TO ANY PERSON FOR ANY REASON OR FOR NO REASON,
              INCLUDING WITHOUT LIMITATION FOR BREACH OF ANY REPRESENTATION, WARRANTY, OR COVENANT CONTAINED IN THESE
              TERMS OF USE OR OF ANY APPLICABLE LAW OR REGULATION. WE MAY TERMINATE YOUR USE OR PARTICIPATION IN THE
              SITE, THE APP AND THE SMART CONTRACT OR DELETE YOUR ACCOUNT WITHOUT WARNING, IN OUR SOLE DISCRETION.
            </p>
            <p>
              If we terminate or suspend your account for any reason, you are prohibited from registering and creating a
              new account under your name, a fake or a borrowed name, or the name of any third party, even if you may be
              acting on behalf of the third party. In addition to terminating and suspending your account, we reserve
              the right to take appropriate legal action, including without limitation pursuing civil, criminal, and
              injunctive redress.
            </p>
            <br />
            <br />
            <h2>10. GOVERNING LAW</h2>
            <p>
              This Terms of Use and your use of the Site, the App, and the Smart Contracts are governed by and
              constructed in accordance with the laws of Cayman Islands, Republic of Estonia applicable to agreements
              made and to be entirely performed in the Cayman Island, without regard to its conflicts of law principles.
            </p>
            <br />
            <br />
            <h2>11. DISPUTE RESOLUTION</h2>
            <p>11.1 Informal negotiations</p>
            <p>
              To expedite resolution and control the cost of any dispute, controversy, or claim related to these Terms
              of Use (each a “Dispute" and collectively, the “Disputes") brought by either you or us (individually, a
              “Party" and collectively, the “Parties"), the Parties agree to first attempt to negotiate any Dispute
              (except those Disputes expressly provided below) informally for at least thirty (30) days before
              initiating arbitration. Such informal negotiations commence upon written notice from one Party to the
              other Party.
            </p>
            <p>11.2 Binding Arbitration</p>
            <p>
              If a Party is unable to resolve a Dispute through informal negotiations, the Disputes (except those
              Disputes expressly excluded below) will be finally and exclusively resolved by binding arbitration. YOU
              UNDERSTAND THAT WITHOUT THIS PROVISION, YOU WOULD HAVE THE RIGHT TO SUE IN COURT AND HAVE A JURY TRIAL.
              The arbitration shall be commenced and conducted under the Commercial Arbitration Rules of the American
              Arbitration Association (“AAA") and, where appropriate, the AAA's Supplementary Procedures for
              Consumer-Related Disputes (“AAA Consumer Rules"), both of which are available at the AAA website
              www.adr.org. Your arbitration fees and your share of arbitration compensation shall be governed by the AAA
              Consumer Rules and, where appropriate, limited by the AAA Consumer Rules. If such costs are determined by
              the arbitrator to be excessive, we will pay all the arbitration fees and expenses. Except where otherwise
              required by the applicable AA rules or applicable law, the arbitration can take place in the Cayman
              Islands. Except as otherwise provided herein, the Parties may litigate in court to compel arbitration,
              stay proceedings pending arbitration, or to confirm, modify, vacate, or enter judgement on the award
              entered by the arbitrator.
            </p>
            <p>
              If for any reason, a Dispute proceeds in court rather than arbitration, the Dispute shall be commenced or
              prosecuted in the state and federal courts located in the Cayman Islands, and the Parties hereby consent
              to and waive all defenses of lack of personal jurisdiction, and forum non-conveniens with respect to venue
              and jurisdiction in such state and federal courts.
            </p>
            <p>
              In no event shall any Dispute brought by either Party related in any way to the Site, the App and the
              Smart Contracts be commenced more than one (1) year after the cause of the action arose. If this provision
              is found to be illegal or unenforceable, then neither Party will elect to arbitrate any Dispute falling
              within that portion of this provision found to be illegal or unenforceable and such Dispute shall be
              decided by a court of competent jurisdiction within the courts listed or jurisdiction above, and the
              Parties agree to submit to the personal jurisdiction of that court.
            </p>
            <p>11.3 Exceptions to the Informal Negotiations and Arbitration</p>
            <p>
              The Parties agree that the following Disputes are not subject to the above provision concerning informal
              negotiations and binding arbitration: (a) any Dispute seeking to enforce or protect, or concerning the
              validity of, and of the intellectual property rights of a Party, (b) any Dispute related to, or arising
              from, allegations of theft, piracy, invasion of privacy, or unauthorized use; and (c) any claim for
              injunctive relief. If this provision is found to be illegal and unenforceable, then neither Party will
              elect to arbitrate any Dispute falling within that portion of this provision found to be illegal or
              unenforceable and such Dispute shall be decided by a court of competent jurisdiction within the courts
              listed or jurisdiction above, and the Parties agree to submit to the personal jurisdiction of that court.
            </p>
            <br />
            <br />
            <h2>12. DISCLAIMERS</h2>
            <p>
              YOU EXPRESSLY UNDERSTAND AND AGREE THAT YOUR ACCESS TO AND USE OF THE SITE, THE APP AND THE SMART
              CONTRACTS ARE AT YOUR SOLE RISK, AND THAT THE SITE, THE APP AND THE SMART CONTRACTS ARE PROVIDED "AS IS"
              AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, WHETHER EXPRESS OR IMPLIED. TO THE FULLEST EXTENT
              PERMISSIBLE PURSUANT TO APPLICABLE LAW, WE, OUR SUBSIDIARIES, AFFILIATES, AND LICENSORS MAKE NO EXPRESS
              WARRANTIES AND HEREBY DISCLAIM ALL IMPLIED WARRANTIES REGARDING THE SITE, THE APP AND THE SMART CONTRACTS
              AND ANY PART OF IT (INCLUDING, WITHOUT LIMITATION, THE SITE, ANY SMART CONTRACT, OR ANY EXTERNAL
              WEBSITES), INCLUDING THE IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE,
              NON-INFRINGEMENT, CORRECTNESS, ACCURACY, OR RELIABILITY. WITHOUT LIMITING THE GENERALITY OF THE FOREGOING,
              WE, OUR SUBSIDIARIES, AFFILIATES, AND LICENSORS DO NOT REPRESENT OR WARRANT TO YOU THAT: (I) YOUR ACCESS
              TO OR USE OF THE SITE, THE APP AND THE SMART CONTRACTS WILL MEET YOUR REQUIREMENTS, (II) YOUR ACCESS TO OR
              USE OF THE SITE, THE APP AND THE SMART CONTRACTS WILL BE UNINTERRUPTED, TIMELY, SECURE OR FREE FROM ERROR,
              (III) USAGE DATA PROVIDED THROUGH THE SITE, THE APP AND THE SMART CONTRACTS WILL BE ACCURATE, (III) THE
              SITE, THE APP AND THE SMART CONTRACTS OR ANY CONTENT, SERVICES, OR FEATURES MADE AVAILABLE ON OR THROUGH
              THE SITE, THE APP AND THE SMART CONTRACTS ARE FREE OF VIRUSES OR OTHER HARMFUL COMPONENTS, OR (IV) THAT
              ANY DATA THAT YOU DISCLOSE WHEN YOU USE THE SITE, THE APP AND THE SMART CONTRACTS WILL BE SECURE. SOME
              JURISDICTIONS DO NOT ALLOW THE EXCLUSION OF IMPLIED WARRANTIES IN CONTRACTS WITH CONSUMERS, SO SOME OR ALL
              OF THE ABOVE EXCLUSIONS MAY NOT APPLY TO YOU.
            </p>
            <p>
              YOU ACCEPT THE INHERENT SECURITY RISKS OF PROVIDING INFORMATION AND DEALING ONLINE OVER THE INTERNET AND
              AGREE THAT WE HAVE NO LIABILITY OR RESPONSIBILITY FOR ANY BREACH OF SECURITY UNLESS IT IS DUE TO OUR GROSS
              NEGLIGENCE.
            </p>
            <p>
              WE WILL NOT BE RESPONSIBLE OR LIABLE TO YOU FOR ANY LOSSES YOU INCUR AS THE RESULT OF YOUR USE OF THE
              ETHEREUM NETWORK, BSC NETWORK, THE METAMASK ELECTRONIC WALLET, AND BSC ELECTRONIC WALLET, INCLUDING BUT
              NOT LIMITED TO ANY LOSSES, DAMAGES OR CLAIMS ARISING FROM: (A) USER ERROR, SUCH AS FORGOTTEN PASSWORDS OR
              INCORRECTLY CONSTRUED SMART CONTRACTS OR OTHER TRANSACTIONS; (B) SERVER FAILURE OR DATA LOSS; (C)
              CORRUPTED WALLET FILES; (D) UNAUTHORIZED ACCESS OR ACTIVITIES BY THIRD PARTIES, INCLUDING BUT NOT LIMITED
              TO THE USE OF VIRUSES, PHISHING, BRUTE FORCING OR OTHER MEANS OF ATTACK AGAINST THE APP, ETHEREUM NETWORK,
              OR THE METAMASK ELECTRONIC WALLET.
            </p>
            <p>
              RUNE GUARDIANS ARE INTANGIBLE DIGITAL ASSETS THAT EXIST ONLY BY VIRTUE OF THE OWNERSHIP RECORD MAINTAINED
              ON THE BSC NETWORK. ALL SMART CONTRACTS ARE CONDUCTED AND OCCUR ON THE DECENTRALIZED LEDGER WITHIN THE BSC
              NETWORK. Arken Entertainment Inc. HAS NO CONTROL OVER AND MAKES NO GUARANTEES OR PROMISES WITH RESPECT TO
              SMART CONTRACTS. arken.gg IS NOT RESPONSIBLE FOR LOSSES DUE TO BLOCKCHAINS OR ANY OTHER FEATURES OF THE
              ETHEREUM NETWORK, BSC NETWORK, THE METAMASK ELECTRONIC WALLET, OR BSC ELECTRONIC WALLET. INCLUDING BUT NOT
              LIMITED TO LATE REPORT BY DEVELOPERS OR REPRESENTATIVES (OR NO REPORT AT ALL) OF ANY ISSUES WITH THE
              BLOCKCHAIN SUPPORTING THE ETHEREUM NETWORK, BSC NETWORK, INCLUDING FORKS, TECHNICAL NODE ISSUES, OR ANY
              OTHER ISSUES HAVING FUND LOSSES AS A RESULT.
            </p>
            <br />
            <br />
            <h2>13. LIMITATION OF LIABILITY</h2>
            <p>
              YOU UNDERSTAND AND AGREE THAT WE, OUR SUBSIDIARIES, AFFILIATES, AND LICENSORS WILL NOT BE LIABLE TO YOU OR
              TO ANY THIRD PARTY FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR EXEMPLARY DAMAGES WHICH YOU
              MAY INCUR, HOWSOEVER CAUSED AND UNDER ANY THEORY OF LIABILITY, INCLUDING, WITHOUT LIMITATION, ANY LOSS OF
              PROFITS (WHETHER INCURRED DIRECTLY OR INDIRECTLY), LOSS OF GOODWILL OR BUSINESS REPUTATION, LOSS OF DATA,
              COST OF PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES, OR ANY OTHER INTANGIBLE LOSS, EVEN IF WE HAVE BEEN
              ADVISED OF THE POSSIBILITY OF SUCH DAMAGES.
            </p>
            <p>
              YOU AGREE AND ACKNOWLEDGE THAT OUR TOTAL, AGGREGATE LIABILITY TO YOU FOR ANY AND ALL CLAIMS ARISING OUT OF
              OR RELATING TO THESE TERMS OR YOUR ACCESS TO OR USE OF (OR YOUR INABILITY TO ACCESS OR USE) ANY PORTION OF
              THE SITE, THE APP AND THE SMART CONTRACTS, WHETHER IN CONTRACT, TORT, STRICT LIABILITY, OR ANY OTHER LEGAL
              THEORY, IS LIMITED TO THE GREATER OF (A) THE AMOUNTS YOU ACTUALLY PAID US UNDER THESE TERMS IN THE TWELVE
              (12) MONTH PERIOD PRECEDING THE DATE THE CLAIM AROSE, OR (B) ONE HUNDRED (100) US DOLLAR.
            </p>
            <p>
              YOU AGREE AND ACKNOWLEDGE THAT WE HAVE MADE THE SITE, THE APP AND THE SMART CONTRACTS AVAILABLE TO YOU AND
              ENTERED INTO THESE TERMS IN RELIANCE UPON THE WARRANTY DISCLAIMERS AND LIMITATIONS OF LIABILITY SET FORTH
              HEREIN, WHICH REFLECT A REASONABLE AND FAIR ALLOCATION OF RISK BETWEEN THE PARTIES AND FORM AN ESSENTIAL
              BASIS OF THE BARGAIN BETWEEN US. WE WOULD NOT BE ABLE TO PROVIDE THE SITE, THE APP AND THE SMART CONTRACTS
              TO YOU WITHOUT THESE LIMITATIONS.
            </p>
            <p>
              SOME JURISDICTIONS DO NOT ALLOW THE EXCLUSION OR LIMITATION OF INCIDENTAL OR CONSEQUENTIAL DAMAGES, AND
              SOME JURISDICTIONS ALSO LIMIT DISCLAIMERS OR LIMITATIONS OF LIABILITY FOR PERSONAL INJURY FROM CONSUMER
              PRODUCTS, SO THE ABOVE LIMITATIONS MAY NOT APPLY TO PERSONAL INJURY CLAIMS.
            </p>
            <br />
            <br />
            <h2>14. ASSUMPTION OF RISK</h2>
            <p>You accept and acknowledge each of the following:</p>
            <p>
              A. The prices of blockchain assets are extremely volatile. Fluctuations in the price of other digital
              assets could materially and adversely affect the value of your Runes or Arken items, which may also be
              subject to significant price volatility. We cannot guarantee that any purchasers of Runes or Arken items
              will not lose money.
            </p>
            <p>
              B. You are solely responsible for determining what, if any, taxes apply to your Rune-related transactions.
              arken.gg is not responsible for determining the taxes that apply to your transactions on the App, the
              Site, or the Smart Contracts.
            </p>
            <p>
              C. The App does not store, send, or receive Arken items. This is because Arken items exist only by virtue
              of the ownership record maintained on the App’s supporting blockchain on the Binance Smart Chain network.
              Any transfer of Arken items occurs only on the Binance Smart Chain network.
            </p>
            <p>
              D. There are risks associated with using an Internet-based currency, including, but not limited to, the
              risk of hardware, software and Internet connections, the risk of malicious software introduction, and the
              risk that third parties may obtain unauthorized access to information stored within your wallet. You
              accept and acknowledge that arken.gg will not be responsible for any communication failures, disruptions,
              errors, distortions or delays you may experience when using the Binance Smart Chain network, however
              caused.
            </p>
            <p>
              E. A lack of use or public interest in the creation and development of distributed ecosystems could
              negatively impact the development of the Arken ecosystem, and therefore the potential utility or value of
              Arken items.
            </p>
            <p>
              F. The regulatory regime governing blockchain technologies, cryptocurrencies, and tokens is uncertain, and
              new regulations or policies may materially adversely affect the development of the Arken ecosystem, and
              therefore the potential utility or value of Arken items.
            </p>
            <br />
            <br />
            <h2>15. INDEMNIFICATION</h2>
            <p>
              You agree to defend, indemnify, and hold us harmless, including our subsidiaries, affiliates, and all of
              our respective officers, agents, partners, and employees, from and against any loss, damage, liability,
              claim, or demand, including reasonable attorneys' fees and expenses, made by third party due to or arising
              out of: (1) use of the Site, (2) breach of these Terms of Use, (3) any breach of your representations and
              warranties set forth in these Terms of Use, (4) your violation of the rights of a third party, including
              but not limited to intellectual property rights, or (5) any overt harmful act toward any other use of the
              Site, the App and the Smart Contracts with whom you connected via the Site, the App and the Smart
              Contracts. Notwithstanding the foregoing, we reserve the right, at your expense, to assume the exclusive
              defense and control of any matter for which you are required to indemnify us, and you agree to cooperate,
              at your expense, with our defense of such claims. We will use reasonable efforts to notify you of any such
              claim, action or proceeding which is subject to this indemnification upon becoming aware of it.
            </p>
            <br />
            <br />
            <h2>16. USER DATA</h2>
            <p>
              We will maintain certain data that you transmit to the Site, the App and the Smart Contracts for the
              purpose of managing the performance of the Site, the App and the Smart Contracts, as well as data relating
              to your use of the Site, the App and the Smart Contracts. Although we perform regular routine backups of
              data, you are solely responsible for all data that you transmit or that release to any activity you have
              undertaken using the Site, the App and the Smart Contracts. You agree that we shall have no liability to
              you for any loss or corruption of any such data, and you hereby waive any right of action against us
              arising from any such loss or corruption of such data.
            </p>
            <br />
            <br />
            <h2>17. MISCELLANEOUS</h2>
            <p>
              These Terms of Use and any policies or operating rules posted by us on the Site, the App and the Smart
              Contracts, or in respect to the Site, the App and the Smart Contracts constitute the entire agreement and
              understanding between you and us. Our failure to exercise or enforce any right or provision of these Terms
              of Use shall not operate as a waiver of such right or provision. These Terms of Use operate to the fullest
              extent permissible by law. We may assign any or all of our rights and obligations to others at any time.
              We shall not be responsible or liable for any loss, damage, delay, or failure to act caused by any cause
              beyond our reasonable control. If any provision or part of a provision of these Terms of Use is determined
              to be unlawful, void, and unenforceable, that provision or part of the provision is deemed severable these
              Terms of Use and does not affect the validity and enforceability of any remaining provisions. There is no
              joint venture, partnership, employment or agency relationship created between you and us as a result of
              these Terms of Use or use of the Site. You agree that these Terms of Use will not be construed against us
              by virtue of having drafted them. You hereby waive any and all defenses you may have based on the
              electronic form of these Terms of Use and the lack of signing by the parties hereto to execute these Terms
              of Use.
            </p>
            <br />
            <br />
            <br />
            <p>
              <strong>LAST UPDATED: 06.08.2021</strong>
            </p>
          </CardBody>
        </Card>
      </Container>
    </Page>
  );
};

export default Risks;
