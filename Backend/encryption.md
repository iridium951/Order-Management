### **Beschreiben Sie den Unterschied zwischen Asymmetrischer und Symmetrischer Verschlüsselung (Funktionsweise und Vor- bzw. Nachteile). Finden Sie jeweils zwei Algorithmen, beschreiben Sie deren Eigenschaften und wo diese zum Einsatz kommen.** 

#### **Asymmetrische Verschlüsselung** 

Bei der asymmetrischen Verschlüsselung werden zwei verschiedene Schlüssel verwendet, einer für die Verschlüsselung und einer für die Entschlüsselung. Der öffentliche Schlüssel wird zur Verschlüsselung der Daten verwendet, während der private Schlüssel zur Entschlüsselung verwendet wird. Der öffentliche Schlüssel kann frei mit jedem geteilt werden, während der private Schlüssel sicher aufbewahrt werden muss.

**Die Vorteile von asymmetrischer Verschlüsselung sind:** 

- Erhöhte Sicherheit: die privaten Schlüssel müssen niemals an andere Personen weitergegeben werden, dadurch ist es viel schwieriger, den Schlüssel abzufangen oder zu verändern.
- Es besteht keine Notwendigkeit für den Austausch von Schlüssel, wodurch auch das Problem der Verteilung von Schlüssel entfällt.
- Asymmetrische Verschlüsselung kann gleichzeitig digitale Signaturen liefern, die zur Authentifizierung eingesetzt werden können.

**Die Nachteile von asymmetrischer Verschlüsselung sind:** 

- Asymmetrische Verschlüsselungsalgorithmen sind oft komplexer als symmetrische Verschlüsselungsalgorithmen, und somit schwieriger zum Implementieren, Testen und Anwenden.
- Verschlüsselung langsamer als die symmetrische, da sie mehr Rechenleistung erfordert.
- Entsprechend ist es für die Verschlüsselung von großen Dateien oder Nachrichten nicht geeignet, da der Datendurchsatz zusammen mit der Schlüssellänge wächst.


**Beispiele für asymmetrische Verschlüsselungsalgorithmen sind RSA (Rivest–Shamir–Adleman) und ECC (Elliptic Curve Cryptography).** 

RSA:

RSA (Rivest–Shamir–Adleman) ist ein altes asymmetrisches Verschlüsselungsverfahren. Dabei wird ein öffentlicher Schlüssel erstellt, der aus zwei Primzahlen erzeugt wird nachdem man deren Produkt faktorisiert. Die Primzahlen werden geheim gehalten und dienen als Teil des privaten Schlüssels. Jeder kann die Nachrichten mit dem öffentlichen Schlüssel verschlüsseln, entschlüsselt können die aber nur von Menschen werden, die die Primzahlen wissen. Eine Nachricht muss zusätzlich zuerst in natürliche Zahlen umgewandelt werden, damit die RSA Verschlüsselung angewendet wird. Ein großes Vorteil von RSA ist, dass . Zum anderen gibt es keinen bekannten Algorithmus mit dem aus dem öffentlichen Schlüssel, der zum Verschlüsseln eingesetzt wird, der private Schlüssel, der zum Entschlüsseln verwendet wird, berechnet werden kann.

Ein großes Vorteil von RSA, ist die Komplexität. Es gibt keine bekannte Methoden, womit aus dem öffentlichen Schlüssel, der private Schlüssel berechnet werden kann. Auf der anderen Seite ist RSA aber ein relativ langsamer Algorithmus und wird  nicht zur direkten Verschlüsselung von Benutzerdaten verwendet.

RSA kann z.B. in VPNs eingesetzt werden um auf einer sicheren Art und Weise Schlüssel zwischen zwei Parteien auszutauschen. 

ECC:

Die Elliptic Curve Cryptography (ECC) basiert auf der algebraischen Struktur elliptischer Kurven und nutzt ihre Eigenschaften um 2 Schlüssel zu erstellen. Am Anfang wird eine bestimmte elliptische Kurve ausgewählt, sowie ein "Generatorpunkt" der sich auf dieser Kurve befindet. Ein privater Schlüssel wird gewählt, und mit dem Generatorpunkt skalarmultipliziert. Skalarmultiplikation führt zu einem neuen Punkt auf der Kurve, der den öffentlichen Schlüssel darstellt. Zur Verschlüsselung wird der öffentlicher Schlüssel und ein gemeinsamer Punkt auf der Kurve verwendet. Zur Entschlüsselung sind der privater Schlüssel und der gleiche Punkt von vorher nötig.

ECC erlaubt es, auch mit kürzeren Schlüsseln, ein gleiches Sicherheitsniveau zu erreichen wie bei anderen asymmetrischen Verschlüsselungsverfahren (z.B. RSA), und gilt dadurch als effizienter.

ECC wird z.B. von der Kryptowährung Bitcoin verwendet.


#### **Symmetrische Verschlüsselung** 

Bei der symmetrischen Verschlüsselung wird derselbe Schlüssel sowohl für die Verschlüsselung als auch für die Entschlüsselung verwendet. Der Schlüssel muss deswegen sicher gespeichert und zwischen dem Sender und dem Empfänger ausgetauscht werden.

Die Vorteile von symmetrischer Verschlüsselung sind:

- Symmetrische Verschlüsselung ist schneller als die asymmetrische Verschlüsselung, da sie weniger Rechenleistung erfordert.
- Effizienter für große Datenmengen
- Symmetrische Verschlüsselungsalgorithmen sind meist einfacher zu implementieren als asymmetrische Algorithmen.

Die Nachteile von symmetrischer Verschlüsselung sind:

- Weniger sicher, da der Schlüssel irgendwie mit anderen geteilt werden muss.
- Austausch vom Schlüssel kompliziert, da es abgefangen werden kann.
- Kann nicht zur Authentifizierung eingesetzt werden, da keine digitale Signaturen.


**Beispiele für symmetrische Verschlüsselungsalgorithmen sind Advanced Encryption Standard (AES) und Blowfish.** 

AES:

AES ist eine Blockchiffre, d. h. Daten werden in Blöcken von fester Größe (in dem Fall 128 Bit) verschlüsselt. Die Klartext Daten werden in 128-Bit-Blöcke aufgeteilt, danach durchläuft jeder Block mehrere Verschlüsselungsrunden. Jede Runde besteht aus vier Operationen, Bytes werden ersetzt, Zeilen werden um verschiedene Offsets verschoben, Spalten werden gemischt, Datenblock wird mit einem der Rundenschlüssel XOR-verknüpft. Bei dem Entschlüsselungsprozess werden die Operationen in umgekehrter Reihenfolge durchgeführt.

Die Schlüssellänge kann 128, 192 oder 256 Bit betragen, je größer die Schlüsselgröße, desto stärker die Verschlüsselung. 

AES kommt z.B. bei WLAN Verschlüsselung zum Einsatz.

Blowfish:

Der Blowfish-Verschlüsselungsalgorithmus ist ebenfalls eine Blockchiffre und arbeitet mit 64-Bit-Datenblöcken. Der Schlüssel hat eine variable Länge von 32 Bit bis zu 448 Bit. Ähnlich wie bei AES, wird hier die Verschlüsselung, sowie die Entschlüsselung von Daten als Iteration von Runden durchgeführt. Eine sogennante Feistelchiffre wird verwendet.

Blowfish war zur Zeit ihrer Veröffentlichung eine Besonderheit, da viele andere Verschlüsselungsalgorithmen urheberrechtlich oder durch Patente geschützt waren,Blowfish wurde jedoch nicht patentiert und konnte von jedem frei verwendet werden.

Bcrypt nutzt einen Algorithmus der von Blowfish abgeleitet wurde, weil die langsame Schlüsselexpansion (key schedule) mehr Rechenaufwand kostet und somit Schutz gegen Wörterbuchangriffe bietet.
