### **Dennoch: der restliche Datenbestand ist nach wie vor im Klartext in der Datenbank hinterlegt. Überlegen Sie wie sich dieses Problem theoretisch lösen ließe.**

Eine Möglichkeit wäre "Data At Rest Encryption", um (die physisch im Speichersystem eines Rechners) gespeicherte Daten zu verschlüsseln. 
Dabei werden normalerweise symmetrische Schlüsselalgorithmen verwendet - die Klartextdaten werden in Chiffretext verschlüsselt und der Verschlüsselungscode wird getrennt, an einem sicheren Ort (und meist zusätzlich mit identitätsbasierter Zugangskontrolle) gespeichert.

Vor allem bei MongoDB und AWS gibt es eine Methode "Field-Level Encryption" (FLE). Dabei können nicht allen Daten, oder sogar eine Datenbank verschlüsselt werden (wie bei data at rest encryption), sondern einzelne Datenfelder. Dabei können aber vor allem sensible Daten, wie Kreditnummern, Adressen usw verschlüsselt werden. AWS verwendet hier eine asymmetrische Verschlüsselung, d.h. ein öffentlicher Schüssel wird von CloudFront benutzt um die Daten automatisch zu verschlüsseln. Jedoch können nur autorisierte Nutzer mit einem anderen, privaten Schlüssel auf die Daten zugreifen. MongoDB bietet dazu ein Client-Side Field Level Encryption (CSFLE) Feature an.

Es gibt auch die SSL/TLS Verschlüsselung, die wird jedoch dafür benutzt, um die Daten während ihrer Übertragung im Internet zu schützen. Also weniger relevant für diese Aufgabenstellung.
