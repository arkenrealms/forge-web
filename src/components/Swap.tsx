import { CurrencyAmount, JSBI, Token, Trade, TradeType } from '@arcanefinance/sdk';
import { css } from 'styled-components';
import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react';
// import { ArrowDown } from 'react-feather'
import { CardBody, ArrowDownIcon, Button, IconButton, Text, Card2 } from '~/ui';
import styled, { ThemeContext } from 'styled-components';
import AddressInputPanel from '~/components/AddressInputPanel';
import Card from '~/components/Card';
import GreyCard from '~/components/Card/GreyCard';
import { AutoColumn } from '~/components/Column';
import symbolMap from '~/utils/symbolMap';
import ConfirmSwapModal from '~/components/swap/ConfirmSwapModal';
import CurrencyInputPanel from '~/components/CurrencyInputPanel';
import CardNav from '~/components/CardNav';
import { AutoRow, RowBetween } from '~/components/Row';
import AdvancedSwapDetailsDropdown from '~/components/swap/AdvancedSwapDetailsDropdown';
import confirmPriceImpactWithoutFee from '~/components/swap/confirmPriceImpactWithoutFee';
import { ArrowWrapper, BottomGrouping, SwapCallbackError, Wrapper } from '~/components/swap/styleds';
import TradePrice from '~/components/swap/TradePrice';
import TokenWarningModal from '~/components/TokenWarningModal';
import SyrupWarningModal from '~/components/SyrupWarningModal';
import ProgressSteps from '~/components/ProgressSteps';
import { INITIAL_ALLOWED_SLIPPAGE } from '~/constants/index';
import useWeb3 from '~/hooks/useWeb3';
import { useCurrency } from '~/hooks/Tokens';
import { ApprovalState, useApproveCallbackFromTrade } from '~/hooks/useApproveCallback';
import { useSwapCallback } from '~/hooks/useSwapCallback';
import useWrapCallback, { WrapType } from '~/hooks/useWrapCallback';
import { Field } from '~/state/swap/actions';
import { useDefaultsFromURLSearch, useDerivedSwapInfo, useSwapActionHandlers, useSwapState } from '~/state/swap/hooks';
import { useExpertModeManager, useUserDeadline, useUserSlippageTolerance } from '~/state/user/hooks';
import { LinkStyledButton } from '~/components/Shared';
import { maxAmountSpend } from '~/utils/maxAmountSpend';
import { computeTradePriceBreakdown, warningSeverity } from '~/utils/prices';
import Loader from '~/components/Loader';
import useI18n from '~/hooks/useI18n';
import PageHeader from '~/components/PageHeader';
import ConnectWalletButton from '~/components/ConnectWalletButton';
// import ApplicationUpdater from '~/state/application/updater'
// import ListsUpdater from '~/state/lists/updater'
// import MulticallUpdater from '~/state/multicall/updater'
// import TransactionUpdater from '~/state/transactions/updater'
// import ToastListener from '~/components/ToastListener'
import AppBody from './AppBody';

const RuneHolder = styled.div`
  text-align: center;
`;

const Rune = styled.img`
  width: 30px;
  height: 30px;
  margin: 10px;
  cursor: pointer;
`;

let init = false;

function toFixed4(num) {
  return num.toString().match(/^-?\d+(?:\.\d{0,4})?/)[0];
}

const Swap = ({ showMenu = false }) => {
  const loadedUrlParams = useDefaultsFromURLSearch();
  const TranslateString = useI18n();

  const wbnbCurrency = useCurrency('0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c');
  const rxsCurrency = useCurrency('0x2098fef7eeae592038f4f3c4b008515fed0d5886');
  const runeCurrency = useCurrency('0xa9776b590bfc2f956711b3419910a5ec1f63153e');
  const exCurrency = useCurrency('0x210c14fbecc2bd9b6231199470da12ad45f64d45');
  const elmCurrency = useCurrency('0xe00b8109bcb70b1edeb4cf87914efc2805020995');
  const evaCurrency = useCurrency('0x919676B73a8d124597cBbA2E400f81Aa91Aa2450');
  const tyrCurrency = useCurrency('0x125a3e00a9a11317d4d95349e68ba0bc744addc4');
  const nenCurrency = useCurrency('0xef4f66506aaaeeff6d10775ad6f994105d8f11b4');
  const isaCurrency = useCurrency('0x098Afb73F809D8Fe145363F802113E3825d7490C');
  const tatoCurrency = useCurrency('0x5DE72A6fca2144Aa134650bbEA92Cc919244F05D');
  const roCurrency = useCurrency('0x2F25DbD430CdbD1a6eC184c79C56C18918fcc97D');
  const oreCurrency = useCurrency('0x33bc7539D83C1ADB95119A255134e7B584cd5c59');
  const ashCurrency = useCurrency('0x1fC5bffCf855B9D7897F1921363547681F6847Aa');
  const senCurrency = useCurrency('0x346C03fe8BE489baAAc5CE67e817Ff11fb580F98');
  const thalCurrency = useCurrency('0x4ffd3b8ba90f5430cda7f4cc4c0a80df3cd0e495');
  const soloCurrency = useCurrency('0x56DeFe2310109624c20c2E985c3AEa63b9718319');
  const daCurrency = useCurrency('0x94F2E23c7422fa8c5A348a0E6D7C05b0a6C8a5b8');
  const hanCurrency = useCurrency('0x0D3877152BaaC86D42A4123ABBeCd1178d784cC7');
  const ionCurrency = useCurrency('0xa00672c2a70E4CD3919afc2043b4b46e95041425');
  const luxCurrency = useCurrency('0xD481F4eA902e207AAda9Fa093f80d50B19444253');
  const kaCurrency = useCurrency('0x2a74b7d7d44025Bcc344E7dA80d542e7b0586330');
  const fusCurrency = useCurrency('0xcd06c743a1628fB02C15946a56037CD7020F3Bd2');
  const leniCurrency = useCurrency('0xFF0682D330C7a6381214fa541d8D288dD0D098ED');
  const paiCurrency = useCurrency('0xfa3f14C55adaDDC2035083146c1cF768bD035E06');
  const ulnCurrency = useCurrency('0x7e8a6d548a68339481c500f2B56367698A9F7213');
  const morCurrency = useCurrency('0xdfFeB26FbaCF79823C50a4e7DCF69378667c9941');
  const iskCurrency = useCurrency('0x90132915EbDe0CF93283D55AB3fBBA15449f95A9');
  const gonCurrency = useCurrency('0xa89805AB2ca5B70c89B74b3B0346a88a5B8eAc85');
  const valCurrency = useCurrency('0x60E3538610e9f4974A36670842044CB4936e5232');
  const ohCurrency = useCurrency('0x9449D198AB998388a577D4eBfDa4656D9fa3468a');
  const lorCurrency = useCurrency('0x08fb6740Cc5170e48B2Ad8Cc07422d3302EF5e78');
  const suCurrency = useCurrency('0x191472E8E899E98048AeB82faa1AE4Ec3801b936');
  const beruCurrency = useCurrency('0x1656f8d69F2354a9989Fe705c0107190A4815287');
  const juaCurrency = useCurrency('0xBC996F2f6703cc13AA494F846A1c563A4A0f1A80');
  const chinCurrency = useCurrency('0xfb134f1721bc602Eb14148f89e1225dC7C93D8d4');
  const zenoCurrency = useCurrency('0x3e151ca82b3686f555c381530732df1cfc3c7890');

  // token warning stuff
  const [loadedInputCurrency, loadedOutputCurrency] = [
    useCurrency(loadedUrlParams?.inputCurrencyId),
    useCurrency(loadedUrlParams?.outputCurrencyId),
  ];
  const [dismissTokenWarning, setDismissTokenWarning] = useState<boolean>(false);
  const [isSyrup, setIsSyrup] = useState<boolean>(false);
  const [syrupTransactionType, setSyrupTransactionType] = useState<string>('');
  const urlLoadedTokens: Token[] = useMemo(
    () => [loadedInputCurrency, loadedOutputCurrency]?.filter((c): c is Token => c instanceof Token) ?? [],
    [loadedInputCurrency, loadedOutputCurrency]
  );
  const handleConfirmTokenWarning = useCallback(() => {
    setDismissTokenWarning(true);
  }, []);

  const handleConfirmSyrupWarning = useCallback(() => {
    setIsSyrup(false);
    setSyrupTransactionType('');
  }, []);

  const { account } = useWeb3();
  const theme = useContext(ThemeContext);

  const [isExpertMode, toggleSetExpertMode] = useExpertModeManager();

  // get custom setting values for user
  const [deadline] = useUserDeadline();
  const [allowedSlippage] = useUserSlippageTolerance();

  // swap state
  const { independentField, typedValue, recipient } = useSwapState();
  const { v2Trade, currencyBalances, parsedAmount, currencies, inputError: swapInputError } = useDerivedSwapInfo();
  const {
    wrapType,
    execute: onWrap,
    inputError: wrapInputError,
  } = useWrapCallback(currencies[Field.INPUT], currencies[Field.OUTPUT], typedValue);
  const showWrap: boolean = wrapType !== WrapType.NOT_APPLICABLE;
  const trade = showWrap ? undefined : v2Trade;

  const parsedAmounts = showWrap
    ? {
        [Field.INPUT]: parsedAmount,
        [Field.OUTPUT]: parsedAmount,
      }
    : {
        [Field.INPUT]: independentField === Field.INPUT ? parsedAmount : trade?.inputAmount,
        [Field.OUTPUT]: independentField === Field.OUTPUT ? parsedAmount : trade?.outputAmount,
      };

  const { onSwitchTokens, onCurrencySelection, onUserInput, onChangeRecipient } = useSwapActionHandlers();
  const isValid = !swapInputError;
  const dependentField: Field = independentField === Field.INPUT ? Field.OUTPUT : Field.INPUT;

  const handleTypeInput = useCallback(
    (value: string) => {
      onUserInput(
        Field.INPUT,
        value.indexOf('.') !== -1 && value.indexOf('.') !== value.length - 1 && value[value.length - 1] !== '0'
          ? toFixed4(parseFloat(value))
          : value
      );
    },
    [onUserInput]
  );
  const handleTypeOutput = useCallback(
    (value: string) => {
      onUserInput(
        Field.OUTPUT,
        value.indexOf('.') !== -1 && value.indexOf('.') !== value.length - 1 && value[value.length - 1] !== '0'
          ? toFixed4(parseFloat(value))
          : value
      );
    },
    [onUserInput]
  );

  // modal and loading
  const [{ showConfirm, tradeToConfirm, swapErrorMessage, attemptingTxn, txHash }, setSwapState] = useState<{
    showConfirm: boolean;
    tradeToConfirm: Trade | undefined;
    attemptingTxn: boolean;
    swapErrorMessage: string | undefined;
    txHash: string | undefined;
  }>({
    showConfirm: false,
    tradeToConfirm: undefined,
    attemptingTxn: false,
    swapErrorMessage: undefined,
    txHash: undefined,
  });

  const formattedAmounts = {
    [independentField]: typedValue,
    [dependentField]: showWrap
      ? (parsedAmounts[independentField]?.toExact() ?? '')
      : (parsedAmounts[dependentField]?.toSignificant(6) ?? ''),
  };

  const route = trade?.route;
  const userHasSpecifiedInputOutput = Boolean(
    currencies[Field.INPUT] && currencies[Field.OUTPUT] && parsedAmounts[independentField]?.greaterThan(JSBI.BigInt(0))
  );
  const noRoute = !route;

  // check whether the user has approved the router on the input token
  const [approval, approveCallback] = useApproveCallbackFromTrade(trade, allowedSlippage);

  // check if user has gone through approval process, used to show two step buttons, reset on token change
  const [approvalSubmitted, setApprovalSubmitted] = useState<boolean>(false);

  // mark when a user has submitted an approval, reset onTokenSelection for input field
  useEffect(() => {
    if (approval === ApprovalState.PENDING) {
      setApprovalSubmitted(true);
    }
  }, [approval, approvalSubmitted]);

  const maxAmountInput: CurrencyAmount | undefined = maxAmountSpend(currencyBalances[Field.INPUT]);
  const atMaxAmountInput = Boolean(maxAmountInput && parsedAmounts[Field.INPUT]?.equalTo(maxAmountInput));

  // the callback to execute the swap
  const { callback: swapCallback, error: swapCallbackError } = useSwapCallback(
    trade,
    allowedSlippage,
    deadline,
    recipient
  );

  const { priceImpactWithoutFee } = computeTradePriceBreakdown(trade);

  const isWrongSafemoonInput = false; // trade && trade.route.input && trade.route.output.symbol! ? trade?.tradeType === TradeType.EXACT_INPUT && ['SAFEMOON'].includes(trade.route.output.symbol!) : false
  const isWrongRuneOutput =
    trade && trade.route.input && trade.route.output.symbol!
      ? trade?.tradeType === TradeType.EXACT_OUTPUT &&
        [
          // 'RUNE',
          'RXS',
          'EL',
          'ELD',
          'ETH',
          'TIR',
          'NEF',
          'ITH',
          'TAL',
          'RAL',
          'ORT',
          'THUL',
          'AMN',
          'SOL',
          'SHAEL',
          'DOL',
          'HEL',
          'IO',
          'LUM',
          'KO',
          'FAL',
          'LEM',
          'PUL',
          'UM',
          'MAL',
          'IST',
          'GUL',
          'VEX',
          'OHM',
          'SUR',
          'BER',
          'LO',
          'JAH',
          'CHAM',
          'ZOD',
        ].includes(trade.route.output.symbol!)
      : false;

  const switchOutputAndInput = () => {
    const inputAmount = trade?.inputAmount.toExact();
    onUserInput(Field.INPUT, inputAmount!);
    // onSwitchTokens()
  };

  const switchInputAndOutput = () => {
    const outputAmount = trade?.outputAmount.toExact();
    onUserInput(Field.OUTPUT, outputAmount!);
    // onSwitchTokens()
  };

  const handleSwap = useCallback(() => {
    if (!account) return;
    if (priceImpactWithoutFee && !confirmPriceImpactWithoutFee(priceImpactWithoutFee)) {
      return;
    }
    if (!swapCallback) {
      return;
    }
    if (!trade) return;

    if (isWrongRuneOutput) {
      alert(`This doesn't work due to the transfer fee. Type in the top input box.`);
      return;
    }
    if (isWrongSafemoonInput) {
      // alert(`You'll pay the SafeMoon transfer fee this way. Type in the top bottom box instead.`)
      // // trade.tradeType = TradeType.EXACT_INPUT
      // // const inputAmount = trade.inputAmount
      // // trade.inputAmount = trade.outputAmount
      // // trade.outputAmount = inputAmount

      // swapMethods.push(
      //   // @ts-ignore
      //   Router.swapCallParameters({
      //     ...trade,
      //     tradeType: TradeType.EXACT_INPUT,
      //     inputAmount: trade.outputAmount,
      //     outputAmount: trade.inputAmount
      //   }, {
      //     feeOnTransfer: true,
      //     allowedSlippage: new Percent(JSBI.BigInt(Math.floor(allowedSlippage)), BIPS_BASE),
      //     recipient,
      //     ttl: deadline,
      //   })
      // )

      return;
    }

    setSwapState((prevState) => ({
      ...prevState,
      attemptingTxn: true,
      swapErrorMessage: undefined,
      txHash: undefined,
    }));
    swapCallback()
      .then((hash) => {
        setSwapState((prevState) => ({
          ...prevState,
          attemptingTxn: false,
          swapErrorMessage: undefined,
          txHash: hash,
        }));
      })
      .catch((error) => {
        setSwapState((prevState) => ({
          ...prevState,
          attemptingTxn: false,
          swapErrorMessage: error.message,
          txHash: undefined,
        }));
      });
  }, [account, priceImpactWithoutFee, isWrongRuneOutput, isWrongSafemoonInput, swapCallback, setSwapState, trade]);

  // errors
  const [showInverted, setShowInverted] = useState<boolean>(false);

  // warnings on slippage
  const priceImpactSeverity = warningSeverity(priceImpactWithoutFee);

  const isTooManyDecimals = false;

  // show approve flow when: no error on inputs, not approved or pending, or approved in current session
  // never show if price impact is above threshold in non expert mode
  const showApproveFlow =
    !swapInputError &&
    (approval === ApprovalState.NOT_APPROVED ||
      approval === ApprovalState.PENDING ||
      (approvalSubmitted && approval === ApprovalState.APPROVED)) &&
    !(priceImpactSeverity > 3 && !isExpertMode);

  const handleConfirmDismiss = useCallback(() => {
    setSwapState((prevState) => ({ ...prevState, showConfirm: false }));

    // if there was a tx hash, we want to clear the input
    if (txHash) {
      onUserInput(Field.INPUT, '');
    }
  }, [onUserInput, txHash, setSwapState]);

  const handleAcceptChanges = useCallback(() => {
    setSwapState((prevState) => ({ ...prevState, tradeToConfirm: trade }));
  }, [trade]);

  // This will check to see if the user has selected Syrup to either buy or sell.
  // If so, they will be alerted with a warning message.
  const checkForSyrup = useCallback(
    (selected: string, purchaseType: string) => {
      if (selected === 'syrup') {
        setIsSyrup(true);
        setSyrupTransactionType(purchaseType);
      }
    },
    [setIsSyrup, setSyrupTransactionType]
  );

  const handleInputSelect = useCallback(
    (inputCurrency) => {
      setApprovalSubmitted(false); // reset 2 step UI for approvals
      onCurrencySelection(Field.INPUT, inputCurrency);
      if (inputCurrency.symbol.toLowerCase() === 'syrup') {
        checkForSyrup(inputCurrency.symbol.toLowerCase(), 'Selling');
      }
    },
    [onCurrencySelection, setApprovalSubmitted, checkForSyrup]
  );

  const handleMaxInput = useCallback(() => {
    if (maxAmountInput) {
      const value = maxAmountInput.toExact();
      onUserInput(
        Field.INPUT,
        value.indexOf('.') !== -1 && value.indexOf('.') !== value.length - 1 && value[value.length - 1] !== '0'
          ? toFixed4(parseFloat(value))
          : value
      );
    }
  }, [maxAmountInput, onUserInput]);

  const handleOutputSelect = useCallback(
    (outputCurrency) => {
      onCurrencySelection(Field.OUTPUT, outputCurrency);
      if (outputCurrency.symbol.toLowerCase() === 'syrup') {
        checkForSyrup(outputCurrency.symbol.toLowerCase(), 'Buying');
      }
    },
    [onCurrencySelection, checkForSyrup]
  );

  useEffect(() => {
    if (init) return;
    if (!rxsCurrency) return;

    init = true;

    onCurrencySelection(Field.OUTPUT, rxsCurrency!);
  }, [onCurrencySelection, rxsCurrency]);

  useEffect(() => {
    if (init) return;
    if (!rxsCurrency) return;

    init = true;

    onCurrencySelection(Field.OUTPUT, rxsCurrency!);
  }, [onCurrencySelection, rxsCurrency]);

  const Wrapper2 = showMenu ? AppBody : ({ children }) => <div>{children}</div>;
  return (
    <div
      css={css`
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
      `}>
      {/* <>
        <ListsUpdater />
        <ApplicationUpdater />
        <TransactionUpdater />
        <MulticallUpdater />
        <ToastListener />
      </> */}
      <TokenWarningModal
        isOpen={urlLoadedTokens.length > 0 && !dismissTokenWarning}
        tokens={urlLoadedTokens}
        onConfirm={handleConfirmTokenWarning}
      />
      <SyrupWarningModal
        isOpen={isSyrup}
        transactionType={syrupTransactionType}
        onConfirm={handleConfirmSyrupWarning}
      />
      {showMenu ? <CardNav /> : null}
      <Card2 style={{ maxWidth: 600 }}>
        <Wrapper2>
          <Wrapper id="swap-page">
            <ConfirmSwapModal
              isOpen={showConfirm}
              trade={trade}
              originalTrade={tradeToConfirm}
              onAcceptChanges={handleAcceptChanges}
              attemptingTxn={attemptingTxn}
              txHash={txHash}
              recipient={recipient}
              allowedSlippage={allowedSlippage}
              onConfirm={handleSwap}
              swapErrorMessage={swapErrorMessage}
              onDismiss={handleConfirmDismiss}
            />
            {showMenu ? (
              <PageHeader
                title={TranslateString(8, 'Exchange')}
                description={TranslateString(1192, 'Trade tokens in an instant')}
              />
            ) : null}
            <CardBody>
              <AutoColumn gap="md">
                <CurrencyInputPanel
                  label={
                    independentField === Field.OUTPUT && !showWrap && trade
                      ? TranslateString(194, 'From (estimated)')
                      : TranslateString(76, 'From')
                  }
                  value={formattedAmounts[Field.INPUT]}
                  showMaxButton={!atMaxAmountInput}
                  currency={currencies[Field.INPUT]}
                  onUserInput={handleTypeInput}
                  onMax={handleMaxInput}
                  onCurrencySelect={handleInputSelect}
                  otherCurrency={currencies[Field.OUTPUT]}
                  id="swap-currency-input"
                />
                <AutoColumn justify="space-between">
                  <AutoRow justify={isExpertMode ? 'space-between' : 'center'} style={{ padding: '0 1rem' }}>
                    <ArrowWrapper clickable>
                      <IconButton
                        variant="tertiary"
                        onClick={() => {
                          setApprovalSubmitted(false); // reset 2 step UI for approvals
                          onSwitchTokens();
                        }}
                        style={{ borderRadius: '50%' }}
                        scale="sm">
                        <ArrowDownIcon color="primary" width="24px" />
                      </IconButton>
                    </ArrowWrapper>
                    {recipient === null && !showWrap && isExpertMode ? (
                      <LinkStyledButton id="add-recipient-button" onClick={() => onChangeRecipient('')}>
                        + Add a send (optional)
                      </LinkStyledButton>
                    ) : null}
                  </AutoRow>
                </AutoColumn>
                <CurrencyInputPanel
                  value={formattedAmounts[Field.OUTPUT]}
                  onUserInput={handleTypeOutput}
                  label={
                    independentField === Field.INPUT && !showWrap && trade
                      ? TranslateString(196, 'To (estimated)')
                      : TranslateString(80, 'To')
                  }
                  showMaxButton={false}
                  currency={currencies[Field.OUTPUT]}
                  onCurrencySelect={handleOutputSelect}
                  otherCurrency={currencies[Field.INPUT]}
                  id="swap-currency-output"
                />

                {recipient !== null && !showWrap ? (
                  <>
                    <AutoRow justify="space-between" style={{ padding: '0 1rem' }}>
                      <ArrowWrapper clickable={false}>
                        <ArrowDownIcon color="primary" width="24px" />
                      </ArrowWrapper>
                      <LinkStyledButton id="remove-recipient-button" onClick={() => onChangeRecipient(null)}>
                        - Remove send
                      </LinkStyledButton>
                    </AutoRow>
                    <AddressInputPanel id="recipient" value={recipient} onChange={onChangeRecipient} />
                  </>
                ) : null}

                {showWrap ? null : (
                  <Card padding=".25rem .75rem 0 .75rem" borderRadius="20px">
                    <AutoColumn gap="4px">
                      {Boolean(trade) && (
                        <RowBetween align="center">
                          <Text fontSize="14px">{TranslateString(1182, 'Price')}</Text>
                          <TradePrice
                            price={trade?.executionPrice}
                            showInverted={showInverted}
                            setShowInverted={setShowInverted}
                          />
                        </RowBetween>
                      )}
                      {allowedSlippage !== INITIAL_ALLOWED_SLIPPAGE && (
                        <RowBetween align="center">
                          <Text fontSize="14px" onClick={toggleSetExpertMode}>
                            {TranslateString(88, 'Slippage Tolerance')}
                          </Text>
                          <Text fontSize="14px">{allowedSlippage / 100}%</Text>
                        </RowBetween>
                      )}
                    </AutoColumn>
                  </Card>
                )}
              </AutoColumn>
              <BottomGrouping>
                {isTooManyDecimals ? (
                  <Button width="100%" onClick={switchOutputAndInput}>
                    Update Decimals
                  </Button>
                ) : isWrongRuneOutput ? (
                  <Button width="100%" onClick={switchOutputAndInput}>
                    Update Price
                  </Button>
                ) : isWrongSafemoonInput ? (
                  <Button width="100%" onClick={switchInputAndOutput}>
                    Update Price
                  </Button>
                ) : (
                  <>
                    {!account ? (
                      <ConnectWalletButton width="100%" />
                    ) : showWrap ? (
                      <Button disabled={Boolean(wrapInputError)} onClick={onWrap} width="100%">
                        {wrapInputError ??
                          (wrapType === WrapType.WRAP ? 'Wrap' : wrapType === WrapType.UNWRAP ? 'Unwrap' : null)}
                      </Button>
                    ) : noRoute && userHasSpecifiedInputOutput ? (
                      <GreyCard style={{ textAlign: 'center' }}>
                        <Text mb="4px">{TranslateString(1194, 'Loading...')}</Text>
                      </GreyCard>
                    ) : showApproveFlow ? (
                      <RowBetween>
                        <Button
                          onClick={approveCallback}
                          disabled={approval !== ApprovalState.NOT_APPROVED || approvalSubmitted}
                          style={{ width: '48%' }}
                          variant={approval === ApprovalState.APPROVED ? 'success' : 'primary'}>
                          {approval === ApprovalState.PENDING ? (
                            <AutoRow gap="6px" justify="center">
                              Approving <Loader stroke="white" />
                            </AutoRow>
                          ) : approvalSubmitted && approval === ApprovalState.APPROVED ? (
                            'Approved'
                          ) : (
                            `Approve ${symbolMap(currencies[Field.INPUT]?.symbol)}`
                          )}
                        </Button>
                        <Button
                          onClick={() => {
                            if (isExpertMode) {
                              handleSwap();
                            } else {
                              setSwapState({
                                tradeToConfirm: trade,
                                attemptingTxn: false,
                                swapErrorMessage: undefined,
                                showConfirm: true,
                                txHash: undefined,
                              });
                            }
                          }}
                          style={{ width: '48%' }}
                          id="swap-button"
                          disabled={
                            !isValid ||
                            approval !== ApprovalState.APPROVED ||
                            (priceImpactSeverity > 3 && !isExpertMode)
                          }
                          variant={isValid && priceImpactSeverity > 2 ? 'danger' : 'primary'}>
                          {priceImpactSeverity > 3 && !isExpertMode
                            ? `Price Impact High`
                            : `Swap${priceImpactSeverity > 2 ? ' Anyway' : ''}`}
                        </Button>
                      </RowBetween>
                    ) : (
                      <Button
                        onClick={() => {
                          if (isExpertMode) {
                            handleSwap();
                          } else {
                            setSwapState({
                              tradeToConfirm: trade,
                              attemptingTxn: false,
                              swapErrorMessage: undefined,
                              showConfirm: true,
                              txHash: undefined,
                            });
                          }
                        }}
                        id="swap-button"
                        disabled={!isValid || (priceImpactSeverity > 3 && !isExpertMode) || !!swapCallbackError}
                        variant={isValid && priceImpactSeverity > 2 && !swapCallbackError ? 'danger' : 'primary'}
                        width="100%">
                        {swapInputError ||
                          (priceImpactSeverity > 3 && !isExpertMode
                            ? `Price Impact Too High`
                            : `Swap${priceImpactSeverity > 2 ? ' Anyway' : ''}`)}
                      </Button>
                    )}
                  </>
                )}
                {showApproveFlow && <ProgressSteps steps={[approval === ApprovalState.APPROVED]} />}
                {isExpertMode && swapErrorMessage ? <SwapCallbackError error={swapErrorMessage} /> : null}
              </BottomGrouping>
            </CardBody>
            <RuneHolder>
              {/* <Rune src="/images/farms/bnb.png" onClick={() => onCurrencySelection(Field.OUTPUT, wbnbCurrency!)} /> */}
              {/* <Rune src="https://safemoon.net/public/img/favicon.png" onClick={() => onCurrencySelection(Field.OUTPUT, safeCurrency!)} /> */}
              {/* <Rune src="/images/rune-500x500.png" onClick={() => onCurrencySelection(Field.OUTPUT, runeCurrency!)} /> */}
              {/* <Rune src="/images/rune-500x500.png" onClick={() => onCurrencySelection(Field.OUTPUT, rxsCurrency!)} /> */}
              <Rune src="/images/farms/ex.png" onClick={() => onCurrencySelection(Field.OUTPUT, exCurrency!)} />
              <Rune src="/images/farms/elm.png" onClick={() => onCurrencySelection(Field.OUTPUT, elmCurrency!)} />
              <Rune src="/images/farms/eva.png" onClick={() => onCurrencySelection(Field.OUTPUT, evaCurrency!)} />
              <Rune src="/images/farms/tyr.png" onClick={() => onCurrencySelection(Field.OUTPUT, tyrCurrency!)} />
              <Rune src="/images/farms/nen.png" onClick={() => onCurrencySelection(Field.OUTPUT, nenCurrency!)} />
              <Rune src="/images/farms/isa.png" onClick={() => onCurrencySelection(Field.OUTPUT, isaCurrency!)} />
              <Rune src="/images/farms/tato.png" onClick={() => onCurrencySelection(Field.OUTPUT, tatoCurrency!)} />
              <Rune src="/images/farms/ro.png" onClick={() => onCurrencySelection(Field.OUTPUT, roCurrency!)} />
              <Rune src="/images/farms/ore.png" onClick={() => onCurrencySelection(Field.OUTPUT, oreCurrency!)} />
              <Rune src="/images/farms/ash.png" onClick={() => onCurrencySelection(Field.OUTPUT, ashCurrency!)} />
              <Rune src="/images/farms/sen.png" onClick={() => onCurrencySelection(Field.OUTPUT, senCurrency!)} />
              <Rune src="/images/farms/thal.png" onClick={() => onCurrencySelection(Field.OUTPUT, thalCurrency!)} />
              <Rune src="/images/farms/solo.png" onClick={() => onCurrencySelection(Field.OUTPUT, soloCurrency!)} />
              <Rune src="/images/farms/da.png" onClick={() => onCurrencySelection(Field.OUTPUT, daCurrency!)} />
              <Rune src="/images/farms/han.png" onClick={() => onCurrencySelection(Field.OUTPUT, hanCurrency!)} />
              <Rune src="/images/farms/ion.png" onClick={() => onCurrencySelection(Field.OUTPUT, ionCurrency!)} />
              <Rune src="/images/farms/lux.png" onClick={() => onCurrencySelection(Field.OUTPUT, luxCurrency!)} />
              <Rune src="/images/farms/ka.png" onClick={() => onCurrencySelection(Field.OUTPUT, kaCurrency!)} />
              <Rune src="/images/farms/fus.png" onClick={() => onCurrencySelection(Field.OUTPUT, fusCurrency!)} />
              <Rune src="/images/farms/leni.png" onClick={() => onCurrencySelection(Field.OUTPUT, leniCurrency!)} />
              <Rune src="/images/farms/pai.png" onClick={() => onCurrencySelection(Field.OUTPUT, paiCurrency!)} />
              <Rune src="/images/farms/uln.png" onClick={() => onCurrencySelection(Field.OUTPUT, ulnCurrency!)} />
              <Rune src="/images/farms/mor.png" onClick={() => onCurrencySelection(Field.OUTPUT, morCurrency!)} />
              <Rune src="/images/farms/isk.png" onClick={() => onCurrencySelection(Field.OUTPUT, iskCurrency!)} />
              <Rune src="/images/farms/gon.png" onClick={() => onCurrencySelection(Field.OUTPUT, gonCurrency!)} />
              <Rune src="/images/farms/val.png" onClick={() => onCurrencySelection(Field.OUTPUT, valCurrency!)} />
              <Rune src="/images/farms/oh.png" onClick={() => onCurrencySelection(Field.OUTPUT, ohCurrency!)} />
              <Rune src="/images/farms/lor.png" onClick={() => onCurrencySelection(Field.OUTPUT, lorCurrency!)} />
              <Rune src="/images/farms/su.png" onClick={() => onCurrencySelection(Field.OUTPUT, suCurrency!)} />
              <Rune src="/images/farms/beru.png" onClick={() => onCurrencySelection(Field.OUTPUT, beruCurrency!)} />
              <Rune src="/images/farms/jua.png" onClick={() => onCurrencySelection(Field.OUTPUT, juaCurrency!)} />
              <Rune src="/images/farms/chin.png" onClick={() => onCurrencySelection(Field.OUTPUT, chinCurrency!)} />
              <Rune src="/images/farms/zeno.png" onClick={() => onCurrencySelection(Field.OUTPUT, zenoCurrency!)} />
            </RuneHolder>
          </Wrapper>
        </Wrapper2>
      </Card2>
      <AdvancedSwapDetailsDropdown trade={trade} />
    </div>
  );
};

export default Swap;
