'use client';

import React from 'react';
import { motion } from 'framer-motion';

const ErrorBox = ({ message }: { message: string | undefined }) => {
    return (
        <motion.div
            className="mt-4 p-4 border-l-4 border-red-600 bg-red-100 dark:bg-red-900 dark:border-red-800 rounded"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.5 }}
        >
            <p className="text-red-800 dark:text-red-300">{message}</p>
        </motion.div>
    );
};

export default ErrorBox;
