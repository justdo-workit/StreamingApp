"use client";

import { useState, forwardRef, useImperativeHandle, useEffect } from "react";
import { AlertDialog, AlertDialogAction, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Progress } from "../ui/progress";
import AdPlaceholder from "../shared/AdPlaceholder";

type AdModalState = {
    type: 'cpv' | 'onClick' | 'rewarded' | 'interstitial' | null;
    isOpen: boolean;
    onConfirm?: () => void;
};

export type AdModalHandles = {
  showCpvAd: (onConfirm: () => void) => void;
  showOnClickAd: () => void;
  showRewardedAd: (onConfirm: () => void) => void;
};

const AdModals = forwardRef<AdModalHandles, {}>((props, ref) => {
    const [modalState, setModalState] = useState<AdModalState>({ type: null, isOpen: false });
    const [progress, setProgress] = useState(0);
    const [showInterstitial, setShowInterstitial] = useState(false);

    // Timer for interstitial ad
    useEffect(() => {
        const timer = setTimeout(() => {
            setShowInterstitial(true);
            setModalState({ type: 'interstitial', isOpen: true });
        }, 3 * 60 * 1000); // 3 minutes
        
        return () => clearTimeout(timer);
    }, []);

    // Timer for ad progress
    useEffect(() => {
        if (!modalState.isOpen || modalState.type === 'interstitial') return;
        
        setProgress(0);
        const adDuration = 5000; // 5 seconds
        const interval = setInterval(() => {
            setProgress(prev => {
                if (prev >= 100) {
                    clearInterval(interval);
                    return 100;
                }
                return prev + (100 / (adDuration / 100));
            });
        }, 100);

        return () => clearInterval(interval);
    }, [modalState.isOpen, modalState.type]);

    useImperativeHandle(ref, () => ({
        showCpvAd: (onConfirm) => setModalState({ type: 'cpv', isOpen: true, onConfirm }),
        showOnClickAd: () => setModalState({ type: 'onClick', isOpen: true }),
        showRewardedAd: (onConfirm) => setModalState({ type: 'rewarded', isOpen: true, onConfirm }),
    }));
    
    const handleClose = () => {
        if(progress < 100 && modalState.type !== 'interstitial') return; // Prevent closing before ad finishes
        
        if (modalState.onConfirm) {
            modalState.onConfirm();
        }
        setModalState({ type: null, isOpen: false });
        setProgress(0);
        if (modalState.type === 'interstitial') {
            setShowInterstitial(false); // Prevent interstitial from re-opening
        }
    };
    
    const getAdInfo = () => {
        switch (modalState.type) {
            case 'cpv': return { title: 'Unlock HD Streaming', description: 'Watch a short ad to unlock high definition streaming for the rest of the session.', adLabel: 'CPV Ad' };
            case 'onClick': return { title: 'Supporting the Stream', description: 'Thanks for your support! This ad plays once per session on your first interaction.', adLabel: 'On-Click Ad' };
            case 'rewarded': return { title: 'Unlock Live Stats', description: 'Watch this ad to unlock detailed live statistics for the race.', adLabel: 'Rewarded Ad' };
            case 'interstitial': return { title: 'A message from our sponsors', description: 'This ad is shown once per session to help keep the streams free.', adLabel: 'Interstitial Ad' };
            default: return { title: '', description: '', adLabel: ''};
        }
    }

    const { title, description, adLabel } = getAdInfo();

    return (
        <AlertDialog open={modalState.isOpen}>
            <AlertDialogContent onEscapeKeyDown={handleClose}>
                <AlertDialogHeader>
                    <AlertDialogTitle>{title}</AlertDialogTitle>
                    <AlertDialogDescription>{description}</AlertDialogDescription>
                </AlertDialogHeader>
                <AdPlaceholder label={adLabel} className="h-48 w-full" />
                <AlertDialogFooter className="flex-col gap-2">
                    {modalState.type !== 'interstitial' && <Progress value={progress} className="w-full h-2" />}
                     <AlertDialogAction onClick={handleClose} disabled={progress < 100 && modalState.type !== 'interstitial'}>
                        {progress < 100 && modalState.type !== 'interstitial' ? `Continue in ${(5 - (progress/20)).toFixed(0)}s` : 'Continue'}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
});

AdModals.displayName = 'AdModals';

export default AdModals;
