export interface PolicySection {
  id: string;
  title: string;
  content: string; // HTML string for formatted content
}

export const codeOfEthicsData: PolicySection[] = [
  {
    id: "preamble",
    title: "PREAMBLE",
    content: `
      <p>The Federation of Information Technology Industry of Sri Lanka (FITIS) together with all the information technology associations which have presently subscribed to FITIS and constituting its member associations have decided and resolved to adopt this Code of Ethics and Professional Conduct (Code) and each association has undertaken to follow and be bound by this Code and apply the Code to all individual and associate members if any, of each such association.</p>

      <p>The associations subscribed as members of FITIS as at the date of first adoption of this Code are and to whom this Code becomes applicable as from the date of first adoption are:</p>

      <ul class="list-decimal pl-6 space-y-2 font-medium">
        <li>The Software Chapter</li>
        <li>The Hardware Chapter</li>
        <li>The Education and Training Chapter</li>
        <li>The Communication Chapter</li>
        <li>The Digital Services Chapter</li>
        <li>The Office Automation Chapter</li>
        <li>The Professional Chapter</li>
      </ul>
    `
  },
  {
    id: "adoption-scope-and-application",
    title: "1. ADOPTION, SCOPE AND APPLICATION",
    content: `
      <div class="space-y-4">
        <div class="flex gap-4">
          <span class="font-bold min-w-[24px]">1.1.</span>
          <div>
            <p>This Code is applicable to:</p>
            <ul class="list-[lower-alpha] pl-6 mt-2 space-y-2">
              <li>All information technology associations which have subscribed to the membership of FITIS.</li>
              <li>Any new association subscribing to the membership of FITIS, such membership being effective and valid only upon the adoption of this Code by the new association.</li>
              <li>Each and every individual member of each of such association being a member of FITIS.</li>
            </ul>
          </div>
        </div>

        <div class="flex gap-4">
          <span class="font-bold min-w-[24px]">1.2.</span>
          <p>Any of the member associations of FITIS are free to terminate the membership with FITIS and leave FITIS whereupon such association may elect to retain this code with such modifications as may be deemed appropriate or adopt its own code. So long as any association remains a member of FITIS, such association and its members shall be bound by this Code which shall remain applicable during the entire period of membership.</p>
        </div>

        <div class="flex gap-4">
          <span class="font-bold min-w-[24px]">1.3.</span>
          <p>Each member association of FITIS agree irrevocably to uphold and promote this Code and acknowledge that violations of any provisions of this Code as being inconsistent with membership of FITIS or if the violation is by a member of an association the membership of such member in such association.</p>
        </div>

        <div class="flex gap-4">
          <span class="font-bold min-w-[24px]">1.4.</span>
          <p>Each member association of FITIS acknowledge that this Code has been adopted and applied in order to enhance and promote ethics, professional conduct and discipline amongst each member association of FITIS and the membership of each respective association and to safeguard and enhance the common goals and interests FITIS and of each member association of FITIS. This Code shall be interpreted and applied in this spirit by FITIS and each member association of FITIS.</p>
        </div>

        <div class="flex gap-4">
          <span class="font-bold min-w-[24px]">1.5.</span>
          <p>In cases of doubt regarding the application or interpretation of this Code a member association of FITIS or a member of any particular association through its association is entitled to refer the matter to FITIS for clarification and direction and FITIS shall act without delay in such matters. The association or member as the case may be will be bound by such clarification or determination made by FITIS.</p>
        </div>
      </div>
    `
  },
  {
    id: "governing-principles",
    title: "2. GOVERNING PRINCIPLES",
    content: `
      <div class="space-y-4">
        <div class="flex gap-4">
          <span class="font-bold min-w-[24px]">2.1.</span>
          <p>The Code consists of a series of statements and norms, which prescribe minimum standards of practice, to be observed by all member associations of FITIS and all members of each of the associations of FITIS as the context may require.</p>
        </div>

        <div class="flex gap-4">
          <span class="font-bold min-w-[24px]">2.2.</span>
          <p>The Code where so required is to be viewed as a whole. Individual parts are not intended to be used in isolation to justify errors of omission or commission.</p>
        </div>

        <div class="flex gap-4">
          <span class="font-bold min-w-[24px]">2.3.</span>
          <p>Ethical conduct, in the true sense, is more than merely abiding by the letter of explicit prohibitions. Rather, it requires unswerving commitment to honourable behaviour, even at the sacrifice of personal advantage.</p>
        </div>

        <div class="flex gap-4">
          <span class="font-bold min-w-[24px]">2.4.</span>
          <p>The Code is primarily concerned with professional responsibility. All members have responsibilities to clients, to users, to the State and society at large. A member should conduct himself with diligence, efficiency, courtesy, and consideration towards all those whom he comes into contact in the course of his professional work.</p>
        </div>

        <div class="flex gap-4">
          <span class="font-bold min-w-[24px]">2.5.</span>
          <p>The Code sets standards of conduct to members and states the fundamental principles that have to be observed by members in order to achieve common objectives.</p>
        </div>

        <div class="flex gap-4">
          <span class="font-bold min-w-[24px]">2.6.</span>
          <p>Further the code assumes that unless a limitation is specifically stated, the objectives and fundamental requirements are equally valid for all members, whether they be in public or private employment, private practice, industry, commerce, education or other related professional service.</p>
        </div>

        <div class="flex gap-4">
          <span class="font-bold min-w-[24px]">2.7.</span>
          <div>
            <p>A profession is distinguished by certain characteristics including:</p>
            <ul class="list-disc pl-6 mt-2 space-y-2">
              <li>Mastery of a particular intellectual skill acquired by training and education.</li>
              <li>Acceptance of duties to society as a whole, in addition to duties to the client or employer.</li>
              <li>An outlook which is essentially objective.</li>
              <li>Rendering personal services to a high standard of conduct and performance.</li>
            </ul>
          </div>
        </div>
      </div>
    `
  },
  {
    id: "terminology",
    title: "3. TERMINOLOGY",
    content: `
      <p class="mb-4">The following definitions apply to the reading of this code.</p>

      <div class="space-y-4">
        <p><strong>Advertising:</strong> The communication to the public of information as to the services or skills provided by members with a view to providing professional services.</p>

        <p><strong>Member association or associations:</strong> As the context may require, an Association or Associations who remain as members of FITIS.</p>

        <p><strong>Client:</strong> Any person, department or organization for whom a member of any Association works, or undertakes to provide any services-based aid, in any way whether for remuneration, fees, payment or otherwise.</p>

        <p><strong>Federation or FITIS:</strong> The Federation of Information Technology Industries of Sri Lanka.</p>

        <p><strong>He:</strong> Includes 'She' or 'Neuter'.</p>

        <p><strong>Member:</strong> Any person or body being a member of a member association and where the context so provides or require any member association.</p>

        <p><strong>Objectivity:</strong> A combination of impartiality, intellectual honesty, and freedom from conflicts of interest.</p>

        <p><strong>Publicity:</strong> The communication to the public of facts about a member which are not designed for the deliberate promotion of that member.</p>

        <p><strong>System:</strong> All applications involving the use of computers. The term does not imply any particular mode of processing (e.g. dedicated, batch or transaction). 'System' may be interpreted as encompassing non-computer procedures such as clerical, manual, communication, and electromechanical processes.</p>

        <p><strong>User:</strong> Any person individual or corporate, institution, department or organization using any services provided by any member of any Association.</p>
      </div>
    `
  },
  {
    id: "the-public-interest",
    title: "4. THE PUBLIC INTEREST",
    content: `
      <div class="space-y-4">
        <div class="flex gap-4">
          <span class="font-bold min-w-[24px]">4.1.</span>
          <p>A distinguishing mark of a profession is acceptance of its responsibility to the public. The public consists of clients, governments, employers, employees, business and financial community, investors and others who rely on the objectivity and integrity of members to maintain the orderly functioning of commerce. This reliance imposes a public interest responsibility on the profession. The public interest is defined as the collective wellbeing of the community of people and institutions the members serve.</p>
        </div>

        <div class="flex gap-4">
          <span class="font-bold min-w-[24px]">4.2.</span>
          <div>
            <p>A member's responsibility is not exclusively to satisfy the needs of an individual client or employer. They should amongst other good conduct and behaviour towards the Public Interest also satisfy in particular the following Public Interests.</p>
            <ul class="list-disc pl-6 mt-2 space-y-2">
              <li>Members in their professional practice should safeguard public health and safety and have regard to protection of the environment.</li>
              <li>Members should have due regard to the legitimate right of third parties.</li>
              <li>Members shall ensure that within their chosen fields they have knowledge and understanding of relevant legislation, regulations, and standards and that they comply with such requirements.</li>
              <li>Members shall in their professional practice have regard to basic human rights and shall avoid any actions that adversely affect such rights.</li>
            </ul>
          </div>
        </div>

        <div class="flex gap-4">
          <span class="font-bold min-w-[24px]">4.3.</span>
          <p>Members can remain in this advantageous position only by continuing to provide the public with services at a level, which demonstrates that the public confidence is firmly founded. It is in the best interest of the profession to make known to users of the services provided by members that they are executed at the highest level of performance and in accordance with ethical requirements that strive to ensure such performance. Members shall abide by such conduct at all times during their professional career.</p>
        </div>
      </div>
    `
  },
  {
    id: "objectives",
    title: "5. OBJECTIVES",
    content: `
      <p class="mb-6">This code recognizes that the objectives of the members are to work to the highest standards of professionalism, to attain the highest levels of performance and generally to meet the public interest requirement set out above. These objectives require four basic needs to be met and members shall be obliged to meet these basic needs.</p>

      <div class="space-y-6 pl-4">
        <div>
          <h4 class="font-bold text-slate-900 mb-1">Credibility</h4>
          <p>In the whole of society there is a need for credibility in information and information systems.</p>
        </div>

        <div>
          <h4 class="font-bold text-slate-900 mb-1">Professionalism</h4>
          <p>There is a need for individuals who can be clearly identified by clients, employers and other interested parties as professional persons.</p>
        </div>

        <div>
          <h4 class="font-bold text-slate-900 mb-1">Quality of Services</h4>
          <p>There is a need for assurance that all services obtained from members are carried out to the highest standards of performance.</p>
        </div>

        <div>
          <h4 class="font-bold text-slate-900 mb-1">Confidence</h4>
          <p>Users of the services of members should be able to feel confident that there exists a framework of professional ethics, which governs the provisions of those services.</p>
        </div>
      </div>
    `
  },
  {
    id: "good-conduct",
    title: "6. GOOD CONDUCT",
    content: `
      <p class="mb-6">In order to achieve the objectives of the profession, members shall also observe the following principles.</p>

      <div class="space-y-6 pl-4">
        <div>
          <h4 class="font-bold text-slate-900 mb-1">Integrity</h4>
          <p>A member should be honest in performing professional services. Members shall not misrepresent or withhold information on the capabilities of products, systems, or services with which they are concerned or take advantage of the lack of knowledge or inexperience. They shall not make exaggerated statements and claims as to the state of affairs existing or expected regarding aspects of the computer industry. Members shall act in a manner based on trust and good faith towards each other and with any other body with whom they interact.</p>
        </div>

        <div>
          <h4 class="font-bold text-slate-900 mb-1">Objectivity</h4>
          <p>A member should be fair and objective and should not allow prejudice or bias or the influence of others to override objectivity.</p>
        </div>

        <div>
          <h4 class="font-bold text-slate-900 mb-1">Confidentiality</h4>
          <p>Information that comes into the possession of members in their professional dealings/conduct must be treated confidentially and should only be disclosed in the ways that are permitted by its owners or mandated by law. Members shall act with complete responsibility when entrusted with confidential information. Members shall also ensure that their subordinates, staff, employees, contractors or agents guard against possible leaks of confidentiality arising from careless use of data or indiscretions.</p>
        </div>

        <div>
          <h4 class="font-bold text-slate-900 mb-1">Professional Competence and Due Care</h4>
          <p>A member should keep himself and his staff informed of such new technologies, practices, legal requirements and standards as are relevant to perform his professional services with due care, competence and diligence to ensure that a client or employer receives the advantage of competent professional service based on up-to-date developments in practice, legislation and techniques.</p>
        </div>

        <div>
          <h4 class="font-bold text-slate-900 mb-1">Technical Standard</h4>
          <p>A member should carry out professional services in accordance with the relevant technical and professional standards. Members should have a duty to carry out with care and skill, the instructions of client in so far as they are compatible and consistent with the requirements of integrity and objectivity.</p>
        </div>
      </div>
    `
  },
  {
    id: "general-guidelines",
    title: "7. GENERAL GUIDELINES",
    content: `
      <p class="mb-4">The principle of objectivity imposes the obligation on all members to be fair, intellectually honest and free of conflicts of interest.</p>

      <p class="mb-4">Members serve in many different capacities and should demonstrate their objectivity in varying circumstances. Members in public practice undertake management advisory services. Regardless of service or capacity, members should protect the integrity of their professional services and maintain objectivity.</p>

      <p class="mb-4">In selecting the situations and practices to be specifically dealt with in ethics requirements relating to objectivity, adequate consideration should be given to the following factors:</p>

      <ul class="list-[lower-alpha] pl-6 space-y-3">
        <li>Members will be exposed to situations which involve the possibility of pressures being exerted on them. These pressures may impair their objectivity.</li>
        <li>It is impracticable to define and prescribe all such situations where these possible pressures exist. Reasonableness should prevail in establishing standards for identifying relationships that are likely to affect objectivity.</li>
        <li>Relationships should be avoided which allow prejudice, bias or influences of others to override objectivity.</li>
        <li>Members have an obligation to ensure that personnel engaged on professional services adhere to the principle of objectivity.</li>
      </ul>
    `
  },
  {
    id: "professional-competence",
    title: "8. PROFESSIONAL COMPETENCE",
    content: `
      <div class="space-y-4">
        <div class="flex gap-4">
          <span class="font-bold min-w-[24px]">8.1.</span>
          <p>Members should accept only such work as he believes he is competent to perform and not to hesitate to obtain additional expertise from appropriately qualified individuals where advisable.</p>
        </div>

        <div class="flex gap-4">
          <span class="font-bold min-w-[24px]">8.2.</span>
          <p>Members shall seek to upgrade their professional knowledge and skill and shall maintain awareness of technological developments, procedures and standards which are relevant to their field.</p>
        </div>

        <div class="flex gap-4">
          <span class="font-bold min-w-[24px]">8.3.</span>
          <p>The maintenance of professional competence requires a continuing awareness of development in the information technology profession including national and international developments.</p>
        </div>

        <div class="flex gap-4">
          <span class="font-bold min-w-[24px]">8.4.</span>
          <p>A member should adopt a program designed to ensure quality control in the performance of professional services consistent with appropriate national and international standards in so far as practicable.</p>
        </div>

        <div class="flex gap-4">
          <span class="font-bold min-w-[24px]">8.5.</span>
          <p>Members should ensure that staff who work for them are competent, well trained and up to date with regard to relevant developments and standards in order to perform professional services.</p>
        </div>

        <div class="mt-6 pt-4 border-t border-slate-100">
          <h4 class="font-bold text-slate-900 mb-2">Due Professional Care</h4>
          <p>Members are expected to conduct professional assignments with diligence while delivering professional services.</p>
        </div>
      </div>
    `
  },
  {
    id: "confidentiality",
    title: "9. CONFIDENTIALITY",
    content: `
      <div class="space-y-4">
        <div class="flex gap-4">
          <span class="font-bold min-w-[24px]">9.1.</span>
          <p>Members have an obligation to respect the confidentiality of information about the client's affair acquired in the course of professional services. The duty of confidentiality continues even after the end of the relationship between the members and the client.</p>
        </div>

        <div class="flex gap-4">
          <span class="font-bold min-w-[24px]">9.2.</span>
          <p>Members have an obligation to secure client's information systems from inadvertent or deliberate improper access or use.</p>
        </div>

        <div class="flex gap-4">
          <span class="font-bold min-w-[24px]">9.3.</span>
          <p>Members shall ensure that their staff are on guard against possible leaks of confidentiality arising from careless use of data or indiscretions.</p>
        </div>

        <div class="bg-slate-50 p-6 rounded-xl my-6">
          <h4 class="font-bold text-slate-900 mb-2">Commentary</h4>
          <p class="mb-4 text-sm text-slate-600">It is the most difficult responsibility of the members to determine the value of a system in terms of what would be lost if system were to be breached. (e.g. damage to national security by leaks of military data, personal privacy by leaks from medical records or fraud by access to financial information).</p>
          <p class="mb-4 text-sm text-slate-600">Situations are also changing, and public is liable to become lax in observing routine practices. Members will therefore find an ongoing security audit extremely valuable in keeping people aware of security requirements and procedures, and in the identification of weaknesses and loopholes in the security system.</p>
          <p class="text-sm text-slate-600">Data processing centres are potentially vulnerable to deliberate damage with consequential seriousness to the business of the organizations involved. As professionals, members should be concerned to treat security drill as a serious matter.</p>
        </div>

        <div class="flex gap-4">
          <span class="font-bold min-w-[24px]">9.4.</span>
          <div>
            <p>Members shall have an obligation to ensure that staff under their control and persons from whom advice and assistance is obtained respect confidentiality.</p>
            <p class="mt-2 text-sm text-slate-600">Confidentiality is not a matter of disclosure of information. It also requires that a member acquiring information in the course of performing professional services shall neither use nor appear to use that information for personal advantage of a third party.</p>
          </div>
        </div>

        <div class="flex gap-4">
          <span class="font-bold min-w-[24px]">9.5.</span>
          <div>
            <p>The following are examples of the points which should be considered in determining the extent to which confidential information may be disclosed.</p>

            <div class="mt-4 space-y-4">
              <div>
                <strong class="text-slate-900 block mb-1">When disclosure is authorized.</strong>
                <p>When authorization to disclose is given by the client or the employer, the interests of all parties including those third parties whose interests might be affected should be considered.</p>
              </div>

              <div>
                <strong class="text-slate-900 block mb-1">When disclosure is required by law.</strong>
                <p>Examples of when a member is required by law to disclose confidential information are:</p>
                <ul class="list-[lower-alpha] pl-6 mt-2 space-y-1">
                  <li>To produce documents or to give evidence in the course of legal proceedings; and</li>
                  <li>To disclose to the appropriate public authorities infringements of the law which come to light.</li>
                </ul>
              </div>

              <div>
                <strong class="text-slate-900 block mb-1">When there is a professional duty or right to disclose:</strong>
                <ul class="list-[lower-alpha] pl-6 mt-2 space-y-1">
                  <li>To comply with technical standards and ethics requirements, such disclosure is not contrary to this section.</li>
                  <li>To protect the professional interests of a member in legal proceedings.</li>
                  <li>To comply with any quality (or peer) review requirements of the Federation.</li>
                  <li>To respond to an inquiry or investigation by the Federation.</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    `
  },
  {
    id: "incompatible-activities",
    title: "10. INCOMPATIBLE ACTIVITIES",
    content: `
      <p class="mb-4">A member should not engage in any activity, which brings or might bring discredit to the profession.</p>

      <div class="bg-slate-50 p-6 rounded-xl">
        <h4 class="font-bold text-slate-900 mb-3">Commentary</h4>
        <ul class="space-y-3 text-sm text-slate-600">
          <li class="flex gap-2"><span class="text-fitis-blue font-bold">•</span> A member should not engage in activity, which brings personal advantage to him or to a third party.</li>
          <li class="flex gap-2"><span class="text-fitis-blue font-bold">•</span> A member should not involve in any incompatible activity in developing system or coding programs, which brings personal advantage to himself or to a third party.</li>
          <li class="flex gap-2"><span class="text-fitis-blue font-bold">•</span> A member in public practice should not render any professional services to a business or activity of an illegal nature.</li>
        </ul>
      </div>
    `
  },
  {
    id: "responsibility-towards-fitis",
    title: "11. RESPONSIBILITY TOWARDS FITIS AND DUE COMPLIANCE",
    content: `
      <div class="space-y-4">
        <div class="flex gap-4">
          <span class="font-bold min-w-[24px]">11.1.</span>
          <p>Members shall have due regard for, and comply with, all relevant laws of the country.</p>
        </div>

        <div class="flex gap-4">
          <span class="font-bold min-w-[24px]">11.2.</span>
          <p>Members shall uphold the reputation of the Federation and shall seek to improve professional standards through participation in their development, use and enforcement, and shall avoid any action, which will adversely affect the good standing of the Federation.</p>
        </div>

        <div class="flex gap-4">
          <span class="font-bold min-w-[24px]">11.3.</span>
          <p>A member who knowingly causes or permits any other person or organization to be in substantial breach of this code or who is a party to such a breach shall himself be guilty of such breach.</p>
        </div>

        <div class="flex gap-4">
          <span class="font-bold min-w-[24px]">11.4.</span>
          <div>
            <p>A member may be held liable for professional misconduct if he:</p>
            <ul class="list-disc pl-6 mt-2 space-y-2">
              <li>Does not supply any information called for by the Federation or does not comply with the directions of the Federation.</li>
              <li>Commits any act, which will bring the Federation to disrepute.</li>
              <li>Allows the use of his name by, or has any personal association with, any enterprise or activity which may bring the member, the Federation, any Association or the profession into disrepute.</li>
              <li>Knowingly makes a false statement to the Association, any other Association, the profession or the Federation.</li>
            </ul>
          </div>
        </div>

        <div class="flex gap-4">
          <span class="font-bold min-w-[24px]">11.5.</span>
          <p>A member who without reasonable cause fails to comply with standards and other professional requirements as may be determined from time to time shall be liable for professional misconduct.</p>
        </div>
      </div>
    `
  },
  {
    id: "contracting",
    title: "12. CONTRACTING",
    content: `
      <div class="space-y-4">
        <div class="flex gap-4">
          <span class="font-bold min-w-[24px]">12.1.</span>
          <p>Members may be required to prepare formal contracts and tender documents for clients. In such instances it is member's duty to review the totality of the detail to be covered in such contracts.</p>
        </div>

        <div class="flex gap-4">
          <span class="font-bold min-w-[24px]">12.2.</span>
          <p>Members should seek assistance or guidance in drawing up contracts or in matters such as commerce, finance, tax, legal or risk evaluation.</p>
        </div>

        <div class="flex gap-4">
          <span class="font-bold min-w-[24px]">12.3.</span>
          <p>Members should not offer or give any bribe or commission or engage in any act of corruption or undue influence in the process leading to the submission of proposals, quotations etc., or the award of contracts where such acts are unethical and/or contrary to the laws for the time being in force.</p>
        </div>

        <div class="flex gap-4">
          <span class="font-bold min-w-[24px]">12.4.</span>
          <p>Members should not subcontract or assign any professional assignment or engagement without prior agreement of the client.</p>
        </div>
      </div>
    `
  },
  {
    id: "declaration-of-interest",
    title: "13. DECLARATION OF INTEREST RELATING TO THE PROVISION OF SERVICES",
    content: `
      <p>Members should declare any financial or other interest in the provision of services to clients and should not withhold any information the client should be apprised of in arriving at a reasoned determination regarding the engagement of professional services.</p>
    `
  },
  {
    id: "disciplinary-procedures",
    title: "14. DISCIPLINARY PROCEDURES",
    content: `
      <div class="space-y-4">
        <div class="flex gap-4">
          <span class="font-bold min-w-[24px]">14.1.</span>
          <p>FITIS may take disciplinary action against any Association or any member of an Association who acts in a manner inconsistent or contrary to the provisions of this Code or does not comply with any of the provisions, directives and expectations set out herein in this Code. Each Member Association hereby expressly grant and confer to FITIS such jurisdiction to take such disciplinary action as prescribed herein either against the Member Association or any member of the Member Association.</p>
        </div>

        <div class="flex gap-4">
          <span class="font-bold min-w-[24px]">14.2.</span>
          <p>For the purpose of taking disciplinary action FITIS shall appoint a panel of eminent professionals, with at least one professional from each Association to ensure fair representation. The President, the Executive Secretary and the Executive Director shall be ex officio members of the Panel.</p>
        </div>

        <div class="flex gap-4">
          <span class="font-bold min-w-[24px]">14.3.</span>
          <p>The Quorum of the disciplinary panel inquiring into any disciplinary matter shall be one third of the members constituting the Panel.</p>
        </div>

        <div class="flex gap-4">
          <span class="font-bold min-w-[24px]">14.4.</span>
          <p>The Executive Director of FITIS shall be the Secretary to the Panel.</p>
        </div>

        <div class="flex gap-4">
          <span class="font-bold min-w-[24px]">14.5.</span>
          <p>Without prejudice to the generality of powers of the Panel, disciplinary action may include warning, admonition, suspension or cancellation of Membership of any Association of FITIS.</p>
        </div>

        <div class="flex gap-4">
          <span class="font-bold min-w-[24px]">14.6.</span>
          <p>FITIS may establish the procedures relating to the meetings, inquiries and disciplinary action by the Panel, the period of appointment to the Panel and the appointment of members to the Panel in the event of resignation or incapacitation or death of any member of the Panel.</p>
        </div>

        <div class="flex gap-4">
          <span class="font-bold min-w-[24px]">14.7.</span>
          <p>In the absence of any specific provision, the Panel may constitute its own procedures as each proceeding may warrant or require.</p>
        </div>

        <div class="flex gap-4">
          <span class="font-bold min-w-[24px]">14.8.</span>
          <p>In addition to any disciplinary action by FITIS, each Association shall be free to adopt its own disciplinary procedure, which however shall be in addition and not in derogation of the powers of FITIS to conduct disciplinary inquiries and to take disciplinary action.</p>
        </div>

        <div class="flex gap-4">
          <span class="font-bold min-w-[24px]">14.9.</span>
          <p>The decision of FITIS in relation to any disciplinary matter as prescribed above shall be final and conclusive and shall not be questioned or challenged in any manner except in so far as specifically enabled or authorized by law.</p>
        </div>
      </div>
    `
  },
  {
    id: "application-and-interpretation",
    title: "15. APPLICATION AND INTERPRETATION",
    content: `
      <div class="space-y-4">
        <p>This Code shall always be applied and interpreted having regard to the spirit of FITIS and the objectives sought to be achieved by the introduction and implementation of the Code.</p>
        <p class="italic text-slate-700 font-medium">Being a member of FITIS hereby adopt this Code and agree to uphold and promote this Code to be bound by and apply the Code to our Members and treat violations of this Code as inconsistent with membership in our Association.</p>
      </div>
    `
  }
];
