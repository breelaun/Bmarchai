
import React from 'react';
import { Card } from "@/components/ui/card";
import Contacts from '@/components/chat/sections/Contacts';

const ContactsPage = () => {
  return (
    <div className="container mx-auto p-4 pt-20">
      <Card className="p-4">
        <Contacts />
      </Card>
    </div>
  );
};

export default ContactsPage;
